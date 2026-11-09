
import { useState, useEffect } from 'react';

import {
  getTeachers,
  addTeacher as saveTeacher,
  updateTeacher as editTeacher,
  deleteTeacher as removeTeacher
} from '../services/teacherApi';

function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // GET: Fetch teachers from local API
  const fetchTeachers = async () => {
    setLoading(true);
    setError('');

    try {
      const savedTeachers = await getTeachers();
      setTeachers(savedTeachers);
    } catch (err) {
      setError('Unable to load teachers. Check JSON Server.');
    } finally {
      setLoading(false);
    }
  };

  // POST: Add a new teacher
  const createTeacher = async (teacherData) => {
    const newTeacher = await saveTeacher(teacherData);

    setTeachers((previousTeachers) => [
      ...previousTeachers,
      newTeacher
    ]);

    return newTeacher;
  };

  // PUT: Update an existing teacher
  const updateTeacher = async (id, teacherData) => {
    const updatedTeacher = await editTeacher(id, teacherData);

    setTeachers((previousTeachers) =>
      previousTeachers.map((teacher) =>
        String(teacher.id) === String(id)
          ? updatedTeacher
          : teacher
      )
    );

    return updatedTeacher;
  };

  // DELETE: Remove a teacher
  const deleteTeacher = async (id) => {
    await removeTeacher(id);

    setTeachers((previousTeachers) =>
      previousTeachers.filter(
        (teacher) => String(teacher.id) !== String(id)
      )
    );
  };

  // Fetch teachers when the component loads
  useEffect(() => {
    fetchTeachers();
  }, []);

  return {
    teachers,
    loading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    refreshTeachers: fetchTeachers
  };
}

export default useTeachers;
