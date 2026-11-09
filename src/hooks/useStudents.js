
import { useState, useEffect } from 'react';

import {
  getLocalStudents,
  addStudent as saveStudent
} from '../services/studentApi';

function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // GET: Fetch students from local API
  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const savedStudents = await getLocalStudents();
      setStudents(savedStudents);
    } catch (err) {
      setError('Unable to load students. Check JSON Server.');
    } finally {
      setLoading(false);
    }
  };

  // POST: Add a new student
  const createStudent = async (studentData) => {
    const newStudent = await saveStudent(studentData);

    setStudents((previousStudents) => [
      ...previousStudents,
      newStudent
    ]);

    return newStudent;
  };

  // Fetch students when the component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    createStudent,
    refreshStudents: fetchStudents
  };
}

export default useStudents;
