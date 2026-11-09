
const API_URL = "http://localhost:3000/teachers";

// GET: Fetch teachers from db.json
export const getTeachers = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }

  return await response.json();
};

// POST: Add teacher
export const addTeacher = async (teacher) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  });

  if (!response.ok) {
    throw new Error("Failed to add teacher");
  }

  return await response.json();
};

// PUT: Update teacher
export const updateTeacher = async (id, teacher) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  });

  if (!response.ok) {
    throw new Error("Failed to update teacher");
  }

  return await response.json();
};

// DELETE: Delete teacher
export const deleteTeacher = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete teacher");
  }

  return true;
};
