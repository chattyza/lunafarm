import api from './axios'

export const getCats = (params) => api.get('/cats', { params })
export const getCat = (id) => api.get(`/cats/${id}`)
export const createCat = (data) => api.post('/cats', data)
export const updateCat = (id, data) => api.put(`/cats/${id}`, data)
export const deleteCat = (id) => api.delete(`/cats/${id}`)

export const uploadImage = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
