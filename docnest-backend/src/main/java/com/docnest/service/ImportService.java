package com.docnest.service;

import com.docnest.dto.ClientDTO;
import com.docnest.entity.Client;
import com.docnest.entity.Location;
import com.docnest.exception.ResourceNotFoundException;
import com.docnest.repository.ClientRepository;
import com.docnest.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ImportService {

    private final ClientRepository clientRepository;
    private final LocationRepository locationRepository;
    private final ActivityService activityService;

    public static class ImportResult {
        public List<Map<String, Object>> successRows = new ArrayList<>();
        public List<Map<String, Object>> errorRows   = new ArrayList<>();
        public int totalRows;
        public int imported;
        public int failed;
    }

    public ImportResult importFromExcel(MultipartFile file) throws IOException {
        ImportResult result = new ImportResult();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = 0;

            for (Row row : sheet) {
                if (rowNum++ == 0) continue; // skip header
                result.totalRows++;

                Map<String, Object> rowData = new LinkedHashMap<>();
                List<String> errors = new ArrayList<>();

                String firstName = getCellString(row, 0);
                String lastName  = getCellString(row, 1);
                String mobile    = getCellString(row, 2);
                String dobStr    = getCellString(row, 3);
                String gender    = getCellString(row, 4);
                String locationName = getCellString(row, 5);

                rowData.put("firstName", firstName);
                rowData.put("lastName",  lastName);
                rowData.put("mobile",    mobile);
                rowData.put("dob",       dobStr);
                rowData.put("gender",    gender);
                rowData.put("location",  locationName);

                if (firstName == null || firstName.isBlank()) errors.add("First name required");
                if (lastName  == null || lastName.isBlank())  errors.add("Last name required");
                if (mobile    == null || mobile.isBlank())    errors.add("Mobile required");
                else if (!mobile.matches("\\d{10}"))          errors.add("Invalid mobile (10 digits)");

                if (!errors.isEmpty()) {
                    rowData.put("errors", errors);
                    result.errorRows.add(rowData);
                    result.failed++;
                    continue;
                }

                // Find or skip location
                Optional<Location> loc = locationRepository.findByLocationNameIgnoreCase(locationName != null ? locationName : "");
                Location location = loc.orElse(null);

                LocalDate dob = null;
                if (dobStr != null && !dobStr.isBlank()) {
                    try { dob = LocalDate.parse(dobStr, DateTimeFormatter.ofPattern("dd/MM/yyyy")); }
                    catch (Exception ignored) { }
                }

                Client client = Client.builder()
                        .firstName(firstName)
                        .lastName(lastName)
                        .mobile(mobile)
                        .dob(dob)
                        .gender(gender)
                        .location(location)
                        .build();

                clientRepository.save(client);
                activityService.log("CLIENT_IMPORTED",
                        "Client imported via Excel: " + firstName + " " + lastName,
                        "CLIENT", client.getId());

                rowData.put("id", client.getId());
                result.successRows.add(rowData);
                result.imported++;
            }
        }
        return result;
    }

    public byte[] generateTemplate() throws IOException {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Clients");
            Row header = sheet.createRow(0);
            String[] cols = {"First Name","Last Name","Mobile","DOB (dd/MM/yyyy)","Gender","Location"};
            CellStyle style = wb.createCellStyle();
            Font font = wb.createFont();
            font.setBold(true);
            style.setFont(font);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(style);
                sheet.autoSizeColumn(i);
            }
            // Sample row
            Row sample = sheet.createRow(1);
            sample.createCell(0).setCellValue("Rahul");
            sample.createCell(1).setCellValue("Sharma");
            sample.createCell(2).setCellValue("9876543210");
            sample.createCell(3).setCellValue("15/06/1990");
            sample.createCell(4).setCellValue("Male");
            sample.createCell(5).setCellValue("Thane");
            wb.write(out);
            return out.toByteArray();
        }
    }

    private String getCellString(Row row, int col) {
        Cell cell = row.getCell(col, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }
}
