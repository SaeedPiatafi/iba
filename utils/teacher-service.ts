import { supabase } from '@/lib/supabase'

export const teacherService = {
  // Get all teachers
  async getAllTeachers() {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get single teacher by ID
  async getTeacherById(id: string) {
    const { data, error } = await supabase
      .from('teacher')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new teacher (client-side - uses API route)
  async createTeacher(teacherData: any) {
    const response = await fetch('/api/admin/teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData)
    })
    
    return await response.json()
  },

  // Update teacher (client-side - uses API route)
  async updateTeacher(id: string, updates: any) {
    const response = await fetch('/api/admin/teacher', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates })
    })
    
    return await response.json()
  },

  // Delete teacher (client-side - uses API route)
  async deleteTeacher(id: string) {
    const response = await fetch(`/api/admin/teacher?id=${id}`, {
      method: 'DELETE'
    })
    
    return await response.json()
  }
}