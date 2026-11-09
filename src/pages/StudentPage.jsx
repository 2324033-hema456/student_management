
import { useState, useEffect } from 'react';

import useStudents from '../hooks/useStudents';

import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import Card from '../components/common/Card';

const emptyForm = {
  name: '',
  email: '',
  department: '',
  year: '',
  cgpa: ''
};

function StudentPage() {
  const { students, loading, error, createStudent } = useStudents();

  const [formData, setFormData] = useState(emptyForm);
  const [formMessage, setFormMessage] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Student details popup
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  // Get top performers
  const topPerformers = students.filter(
    (student) => Number(student.cgpa) > 9
  );

  // Search, filter and sort students
  const filteredStudents = students
    .filter((student) => {
      const searchText = debouncedSearch.toLowerCase();

      const matchesSearch =
        student.name?.toLowerCase().includes(searchText) ||
        student.email?.toLowerCase().includes(searchText);

      const matchesDepartment =
        departmentFilter === 'all' ||
        student.department === departmentFilter;

      const matchesYear =
        yearFilter === 'all' ||
        String(student.year) === yearFilter;

      return matchesSearch && matchesDepartment && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }

      if (sortBy === 'cgpa') {
        return Number(b.cgpa || 0) - Number(a.cgpa || 0);
      }

      if (sortBy === 'cgpa-low') {
        return Number(a.cgpa || 0) - Number(b.cgpa || 0);
      }

      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex = (currentPage - 1) * studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, departmentFilter, yearFilter, sortBy]);

  // Get unique departments
  const departments = [
    ...new Set(
      students.map((student) => student.department).filter(Boolean)
    )
  ];

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Add student
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage('');

    try {
      await createStudent({
        ...formData,
        year: Number(formData.year),
        cgpa: Number(formData.cgpa)
      });

      setFormData({ ...emptyForm });
      setFormMessage('Student added successfully!');
    } catch {
      setFormMessage('Unable to add student. Check JSON Server.');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('all');
    setYearFilter('all');
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <div className="student-page">

      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <span className="page-label">STUDENT DIRECTORY</span>

          <h1>Find, manage and know your students.</h1>

          <p>
            Search, filter, sort and add student records.
            View top performers and explore the complete directory.
          </p>
        </div>

        <Card className="total-students-card">
          <span className="total-icon">👥</span>

          <div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </Card>
      </div>

      {/* TOP PERFORMERS */}
      <section className="top-performers-section">

        <div className="section-heading">
          <div className="section-title">
            <span className="section-icon">🏆</span>

            <div>
              <h2>Top Performers (CGPA &gt; 9)</h2>
              <p>
                Students with CGPA greater than 9 are featured here.
              </p>
            </div>
          </div>

          <span className="section-tag">
            {topPerformers.length} Students
          </span>
        </div>

        <div className="top-performers-grid">

          {topPerformers.map((student) => (
            <Card className="performer-card" key={student.id}>

              <div className="student-avatar">
                {student.name?.charAt(0).toUpperCase()}
              </div>

              <div className="performer-info">
                <h3>{student.name}</h3>

                <p>
                  {student.department} · Year {student.year}
                </p>

                <span className="cgpa-label">CGPA</span>

                <h2>{student.cgpa}</h2>

                <span className="top-badge">
                  ★ Top Performer
                </span>
              </div>

            </Card>
          ))}

          {!loading && topPerformers.length === 0 && (
            <p>No top performers available yet.</p>
          )}

        </div>
      </section>

      {/* STUDENT CONTENT */}
      <div className="student-content">

        {/* ADD STUDENT FORM */}
        <section className="student-form-section">

          <div className="form-title">
            <h2>♟ Add a New Student</h2>
            <p>
              Enter student details to add them to the directory.
            </p>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>

            <FormInput
              label="Full Name *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />

            <FormInput
              label="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />

            <FormInput
              as="select"
              label="Department *"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Economics">Economics</option>
            </FormInput>

            <FormInput
              as="select"
              label="Year of Study *"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </FormInput>

            <FormInput
              label="CGPA *"
              type="number"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              placeholder="Enter CGPA (e.g., 8.5)"
              required
            />

            <Button
              type="submit"
              className="add-student-btn"
            >
              + Add Student
            </Button>

            {formMessage && (
              <p role="status">{formMessage}</p>
            )}

          </form>
        </section>

        {/* ALL STUDENTS */}
        <section className="student-list-section">

          <div className="section-heading">

            <div className="section-title">
              <span className="section-icon">👥</span>

              <div>
                <h2>All Students</h2>
                <p>
                  Search, filter and sort student records.
                </p>
              </div>
            </div>

            <span className="section-tag">
              {filteredStudents.length} Students
            </span>

          </div>

          {/* SEARCH AND FILTERS */}
          <div className="student-controls">

            <FormInput
              type="text"
              placeholder="Search by name or email..."
              className="student-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <FormInput
              as="select"
              label="Department"
              className="student-filter"
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
            >
              <option value="all">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </FormInput>

            <FormInput
              as="select"
              label="Year"
              className="student-filter"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
            >
              <option value="all">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </FormInput>

            <FormInput
              as="select"
              label="Sort by"
              className="student-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="name">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="cgpa">CGPA: High to Low</option>
              <option value="cgpa-low">CGPA: Low to High</option>
            </FormInput>

            <Button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>

          </div>

          {/* STUDENT CARDS */}
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-students">No students found.</p>
          ) : (
            <>

              <div className="student-grid">

                {currentStudents.map((student) => (
                  <Card className="student-card" key={student.id}>

                    <div className="student-avatar">

                      {student.image ? (
                        <img
                          src={student.image}
                          alt={student.name}
                          className="student-image"
                        />
                      ) : (
                        student.name?.charAt(0).toUpperCase()
                      )}

                    </div>

                    <div className="student-card-info">

                      <h3>{student.name}</h3>
                      <p>{student.email}</p>

                      <span>
                        {student.department}
                        {student.year ? ` · Year ${student.year}` : ''}
                      </span>

                      <div className="student-card-bottom">

                        {student.cgpa !== undefined && (
                          <span className="cgpa-label">
                            CGPA {student.cgpa}
                          </span>
                        )}

                      </div>

                      <Button
                        type="button"
                        className="student-view-details-btn"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View Details
                      </Button>

                    </div>

                  </Card>
                ))}

              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">

                  <Button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((number) => (
                    <Button
                      type="button"
                      key={number}
                      className={
                        currentPage === number ? 'active-page' : ''
                      }
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </Button>
                  ))}

                  <Button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                  >
                    Next
                  </Button>

                </div>
              )}

            </>
          )}

        </section>
      </div>

      {/* STUDENT DETAILS POPUP */}
      {selectedStudent && (
        <div
          className="student-details-overlay"
          onClick={() => setSelectedStudent(null)}
        >

          <div
            className="student-details-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="student-details-header">

              <div>
                <h2>Student Details</h2>
                <p>Complete student information</p>
              </div>

              <Button
                type="button"
                className="student-details-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </Button>

            </div>

            <div className="student-details-profile">

              <div className="student-details-avatar">

                {selectedStudent.image ? (
                  <img
                    src={selectedStudent.image}
                    alt={selectedStudent.name}
                  />
                ) : (
                  selectedStudent.name?.charAt(0).toUpperCase()
                )}

              </div>

              <h2>{selectedStudent.name}</h2>
              <p>{selectedStudent.department}</p>

            </div>

            <div className="student-details-grid">

              <div>
                <span>Full Name</span>
                <strong>
                  {selectedStudent.name || 'Not available'}
                </strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>
                  {selectedStudent.email || 'Not available'}
                </strong>
              </div>

              <div>
                <span>Department</span>
                <strong>
                  {selectedStudent.department || 'Not available'}
                </strong>
              </div>

              <div>
                <span>Year of Study</span>
                <strong>
                  {selectedStudent.year
                    ? `Year ${selectedStudent.year}`
                    : 'Not available'}
                </strong>
              </div>

              <div>
                <span>CGPA</span>
                <strong>
                  {selectedStudent.cgpa ?? 'Not available'}
                </strong>
              </div>

              <div>
                <span>Student ID</span>
                <strong>
                  {selectedStudent.id ?? 'Not available'}
                </strong>
              </div>

            </div>

            <Button
              type="button"
              className="student-details-close-action"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </Button>

          </div>
        </div>
      )}

    </div>
  );
}

export default StudentPage;
