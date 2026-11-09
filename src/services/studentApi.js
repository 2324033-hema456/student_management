
const LOCAL_API_URL = 'http://localhost:3000/students';

// GET: Fetch students stored in db.json
export async function getLocalStudents() {
  const response = await fetch(LOCAL_API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }

  return await response.json();
}

// POST: Add a new student
export async function addStudent(student) {
  const response = await fetch(LOCAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  });

  if (!response.ok) {
    throw new Error('Failed to add student');
  }

  return await response.json();
}
