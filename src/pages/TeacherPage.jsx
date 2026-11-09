
import { useMemo, useState } from "react";

import useTeachers from "../hooks/useTeachers";

import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import Card from "../components/common/Card";

const emptyForm = {
  name: "",
  email: "",
  department: "",
  subject: "",
  yearOfStudy: "Year 1",
};

const departmentOptions = [
  "Computer Science",
  "Information Technology",
  "Artificial Intelligence and Data Science",
  "Electronics and Communication",
  "Electrical and Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
];

function TeacherPage() {
  const {
    teachers,
    loading,
    error,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useTeachers();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [subject, setSubject] = useState("All Subjects");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const pageSize = 10;

  const departments = useMemo(
    () =>
      [...new Set(teachers.map((t) => t.department).filter(Boolean))].sort(),
    [teachers]
  );

  const subjects = useMemo(
    () =>
      [...new Set(teachers.map((t) => t.subject).filter(Boolean))].sort(),
    [teachers]
  );

  const filteredTeachers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !searchText ||
        (teacher.name || "").toLowerCase().includes(searchText) ||
        (teacher.email || "").toLowerCase().includes(searchText) ||
        (teacher.department || "").toLowerCase().includes(searchText);

      const matchesDepartment =
        department === "All Departments" ||
        teacher.department === department;

      const matchesSubject =
        subject === "All Subjects" || teacher.subject === subject;

      return matchesSearch && matchesDepartment && matchesSubject;
    });
  }, [teachers, search, department, subject]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTeachers.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  const visibleTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + pageSize
  );

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setSubject("All Subjects");
    setPage(1);
  };

  const openAddForm = () => {
    setEditingTeacher(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  };

  const openEditForm = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      department: teacher.department || "",
      subject: teacher.subject || "",
      yearOfStudy: teacher.yearOfStudy || "Year 1",
    });

    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const teacherData = {
      ...formData,
    };

    try {
      if (editingTeacher) {
        const updatedTeacher = await updateTeacher(
          editingTeacher.id,
          teacherData
        );

        if (
          selectedTeacher &&
          String(selectedTeacher.id) === String(editingTeacher.id)
        ) {
          setSelectedTeacher(updatedTeacher);
        }
      } else {
        await createTeacher(teacherData);
      }

      setShowForm(false);
      setEditingTeacher(null);
      setFormData({ ...emptyForm });
      setPage(1);
    } catch (err) {
      alert("Unable to save teacher. Please try again.");
    }
  };

  const handleDelete = async (teacher) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteTeacher(teacher.id);

      if (selectedTeacher?.id === teacher.id) {
        setSelectedTeacher(null);
      }
    } catch (err) {
      alert("Unable to delete teacher. Please try again.");
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="teacher-page">

      {/* PAGE HEADER */}
      <div className="teacher-header">
        <div>
          <span className="teacher-eyebrow">
            TEACHER MANAGEMENT
          </span>

          <h1>Manage Teachers</h1>

          <p>
            View, add, edit and remove teacher records.
            Manage teacher departments and subjects.
          </p>
        </div>

        <Card className="teacher-total-card">
          <span className="teacher-total-icon">👥</span>

          <div>
            <span>Total Teachers</span>
            <strong>{teachers.length}</strong>
          </div>
        </Card>
      </div>

      {/* FILTER BAR */}
      <div className="teacher-filter-bar">

        <FormInput
          name="search"
          placeholder="⌕ Search by name, email or department..."
          value={search}
          onChange={(e) =>
            handleFilterChange(setSearch, e.target.value)
          }
          className="teacher-search"
        />

        <FormInput
          as="select"
          label="Department"
          name="department"
          value={department}
          onChange={(e) =>
            handleFilterChange(setDepartment, e.target.value)
          }
        >
          <option value="All Departments">All Departments</option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FormInput>

        <FormInput
          as="select"
          label="Subject"
          name="subject"
          value={subject}
          onChange={(e) =>
            handleFilterChange(setSubject, e.target.value)
          }
        >
          <option value="All Subjects">All Subjects</option>

          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FormInput>

        <Button
          className="teacher-clear-btn"
          onClick={clearFilters}
        >
          ↻ Clear Filters
        </Button>
      </div>

      {/* TEACHER LIST */}
      <div className="teacher-list-container">

        {loading ? (
          <p className="teacher-message">Loading teachers...</p>
        ) : error ? (
          <p className="teacher-error">{error}</p>
        ) : filteredTeachers.length === 0 ? (
          <div className="teacher-empty">
            <h3>No teachers found</h3>
            <p>Try changing your search or filters.</p>

            <Button
              className="teacher-add-btn"
              onClick={openAddForm}
            >
              + Add Teacher
            </Button>
          </div>
        ) : (
          <>
            <div className="teacher-table-wrapper">
              <table className="teacher-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>TEACHER NAME</th>
                    <th>EMAIL</th>
                    <th>DEPARTMENT</th>
                    <th>SUBJECT</th>
                    <th>YEAR OF STUDY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleTeachers.map((teacher, index) => (
                    <tr key={teacher.id}>

                      <td>{startIndex + index + 1}</td>

                      <td>
                        <div className="teacher-name-cell">
                          <span className="teacher-avatar-small">
                            {(teacher.name || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <div>
                            <strong>{teacher.name}</strong>
                            <small>{teacher.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{teacher.email}</td>

                      <td>
                        <span className="teacher-department-tag">
                          {teacher.department}
                        </span>
                      </td>

                      <td>{teacher.subject}</td>

                      <td>{teacher.yearOfStudy}</td>

                      <td>
                        <div className="teacher-actions">

                          <Button
                            className="teacher-view-btn"
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            View
                          </Button>

                          <Button
                            className="teacher-edit-btn"
                            onClick={() => openEditForm(teacher)}
                          >
                            Edit
                          </Button>

                          <Button
                            className="teacher-delete-btn"
                            onClick={() => handleDelete(teacher)}
                          >
                            Delete
                          </Button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* PAGINATION */}
            <div className="teacher-pagination">

              <span>
                Showing {startIndex + 1}–
                {Math.min(startIndex + pageSize, filteredTeachers.length)} of{" "}
                {filteredTeachers.length} teachers
              </span>

              <div className="teacher-pagination-buttons">

                <Button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                >
                  ‹
                </Button>

                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((number) => (
                  <Button
                    key={number}
                    className={
                      currentPage === number ? "current" : ""
                    }
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </Button>
                ))}

                <Button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  ›
                </Button>

              </div>
            </div>
          </>
        )}
      </div>

      {/* ADD TEACHER BUTTON */}
      <Button
        className="teacher-floating-add"
        onClick={openAddForm}
      >
        + Add Teacher
      </Button>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div
          className="teacher-modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="teacher-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="teacher-modal-header">
              <div>
                <h2>
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                </h2>

                <p>Enter the teacher information below</p>
              </div>

              <Button
                className="teacher-close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="teacher-form-grid">

                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />

                {/* ONLY ONE DEPARTMENT DROPDOWN */}
                <FormInput
                  as="select"
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>

                  {departmentOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </FormInput>

                <FormInput
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                />

                <FormInput
                  as="select"
                  label="Year of Study"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                >
                  <option value="Year 1">Year 1</option>
                  <option value="Year 2">Year 2</option>
                  <option value="Year 3">Year 3</option>
                  <option value="Year 4">Year 4</option>
                </FormInput>

              </div>

              <div className="teacher-form-buttons">

                <Button
                  className="teacher-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="teacher-save-btn"
                >
                  {editingTeacher ? "Update Teacher" : "Save Teacher"}
                </Button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TEACHER DETAILS */}
      {selectedTeacher && (
        <div
          className="teacher-modal-overlay"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="teacher-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="teacher-modal-header">
              <div>
                <h2>Teacher Details</h2>
                <p>Complete teacher information</p>
              </div>

              <Button
                className="teacher-close-btn"
                onClick={() => setSelectedTeacher(null)}
              >
                ×
              </Button>
            </div>

            <div className="teacher-profile">
              <div className="teacher-avatar">
                {(selectedTeacher.name || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>{selectedTeacher.name}</h2>
              <p>{selectedTeacher.subject}</p>
            </div>

            <div className="teacher-details-grid">

              <div>
                <span>Email</span>
                <strong>{selectedTeacher.email}</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>{selectedTeacher.department}</strong>
              </div>

              <div>
                <span>Subject</span>
                <strong>{selectedTeacher.subject}</strong>
              </div>

              <div>
                <span>Year of Study</span>
                <strong>{selectedTeacher.yearOfStudy}</strong>
              </div>

            </div>

            <Button
              className="teacher-details-close"
              onClick={() => setSelectedTeacher(null)}
            >
              Close
            </Button>

          </div>
        </div>
      )}

    </div>
  );
}

export default TeacherPage;
