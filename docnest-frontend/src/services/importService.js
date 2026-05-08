import api from './api'

export const importService = {
  importExcel: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/import/excel', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  downloadTemplate: () =>
    api.get('/api/import/template', { responseType: 'blob' }),
}
