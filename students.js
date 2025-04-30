console.log('students.js is executing...');

const id_form_create_new_student = document.getElementById("id_form_create_new_student");
id_form_create_new_student.addEventListener('submit', handleCreateNewStudentEvent);

const div_create_new_student = document.getElementById("create_new_student");
const div_show_student_details = document.getElementById("show_student_details");
const div_update_student_details = document.getElementById("update_student_details");
const div_delete_student = document.getElementById("delete_student");
const div_list_of_students = document.getElementById("list_of_students");


//TODO: uncomment the following code to fetch and display the classes after the page loads
/*document.addEventListener("DOMContentLoaded", async function()
{
    await getAndDisplayAllClasses();
});
*/

// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

async function createNewStudent(studentData)
{
    const API_URL = 'http://localhost:8080/students';

    try
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const createdStudent = await response.json();
            div_create_new_student.innerHTML = `<p class="success">Student created successfully. The new student id is ${createdStudent.id}</p>`;
            await getAndDisplayAllStudents();
        }
        else
        {
            div_create_new_student.innerHTML = '<p class="failure">ERROR: failed to create the new student</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_create_new_student.innerHTML = `<p class="failure">ERROR: failed to connect to the API to create the new student</p>`;
    }
}


async function getAndDisplayAllStudents()
{
    console.log('getAndDisplayAllStudents - START');

    const API_URL = "http://localhost:8080/students";

    div_list_of_students.innerHTML = "Calling the API to get the list of students...";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_list_of_students.innerHTML = "Retrieved the students successfully, now we just need to process them...";

            const listOfStudentsAsJSON = await response.json();
            console.log({listOfStudents: listOfStudentsAsJSON});

            displayStudents(listOfStudentsAsJSON);
        }
        else
        {
            div_list_of_students.innerHTML = '<p class="failure">ERROR: failed to retrieve the students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_list_of_students.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the student data.</p>';
    }

    console.log('getAndDisplayAllStudents - END');
}


/**
 * @return the student with id = studentId as JSON or null if the student could not be retrieved from the API
 */
async function getStudent(studentId)
{
    console.log(`getStudent(${studentId}) - START`);
    console.log("studentId = " + studentId);

    const API_URL = "http://localhost:8080/students/" + studentId;

    console.log("Calling the API to get the student with id ${studentId}...");

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            console.log("Retrieved the student successfully, now we just need to process it...");

            const studentAsJSON = await response.json();
            console.log({studentAsJSON});

            return studentAsJSON;
        }
        else
        {
            console.log(`ERROR: failed to retrieve the student with id ${studentId}`);
        }
    }
    catch (error)
    {
        console.error(error);
        console.log(`ERROR: failed to connect to the API to fetch the student with id ${studentId}`);
    }

    console.log(`getClass(${studentId}) - END`);

    // if this code is reached, it means that an error occurred and the class could not be retrieved
    return null;
}


async function updateStudent(studentData)
{
    const API_URL = `http://localhost:8080/students/${studentData.id}`;

    try
    {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_update_student_details.innerHTML = '<p class="success">Student updated successfully</p>';
            await getAndDisplayAllStudents();
        }
        else
        {
            div_update_student_details.innerHTML = '<p class="failure">ERROR: failed to update the student</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_update_student_details.innerHTML = `<p class="failure">ERROR: failed to update the student with id ${studentData.id}</p>`;
    }
}

async function deleteStudent(studentId)
{
    const API_URL = `http://localhost:8080/students/${studentId}`;

    try
    {
        const response = await fetch(API_URL, {method: "DELETE"});
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_delete_student.innerHTML = `<p class="success">Student with id ${studentId} deleted successfully</p>`;
            await getAndDisplayAllStudents();
        }
        else
        {
            div_delete_student.innerHTML = `<p class="failure">ERROR: failed to delete the student with id ${studentId}</p>`;
        }
    }
    catch (error)
    {
        console.error(error);
        div_delete_student.innerHTML = `<p class="failure">ERROR: failed to connect to the API to delete the student with id ${studentId}</p>`;
    }
}


// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

async function handleCreateNewStudentEvent(event)
{
    // Prevent the default form submission behavior which will cause the page to be redirected to the action URL
    event.preventDefault();

    const formData = new FormData(id_form_create_new_student);
    const studentData =
        {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            birthDate: formData.get("birthDate")
        };
    console.log({studentData});
    await createNewStudent(studentData);
}


function displayStudents(listOfStudentsAsJSON)
{
    div_list_of_students.innerHTML = '';

    for (const studentAsJSON of listOfStudentsAsJSON)
    {
        console.log({studentAsJSON});
        div_list_of_students.innerHTML += renderStudentAsHTML(studentAsJSON);
    }
}


function renderStudentAsHTML(studentAsJSON)
{
    // data-id is a custom attribute that we use to store the id of the student, so that we can retrieve it later
    // when the user clicks on the "Show Student Details" button, or the "Update Student Details" button, or the "Delete Student" button

    return `<div class="show-student-in-list" data-id="${studentAsJSON.id}">
        <p>Student ID (this is just for debugging): ${studentAsJSON.id}</p>
        <p>Student First Name: ${studentAsJSON.firstName}</p>
        <p>Student Last Name: ${studentAsJSON.lastName}</p>
        <p>Class description: ${studentAsJSON.birthDate}</p>
        <p>
            <!-- TODO: this is for extra credit -->
            <a href="students.show.html?student_id=${studentAsJSON.id}">Show this student</a>
        </p>
        <button onclick="handleShowStudentDetailsEvent(event)">Show Student Details</button>
        <button onclick="handleUpdateStudentDetailsEvent(event)">Update Student Details</button>
        <button onclick="handleDeleteStudentEvent(event)">Delete Student</button>
    </div>`;
}


async function handleShowStudentDetailsEvent(event)
{
    console.log('handleShowStudentDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const studentId = event.target.parentElement.getAttribute("data-id");
    let studentAsJSON = await getStudent(studentId);
    console.log({studentAsJSON});
    if (studentAsJSON == null)
    {
        div_show_student_details.innerHTML = `<p class="failure">ERROR: failed to retrieve the student with id ${studentId}</p>`;
    }
    else
    {
        displayStudentDetails(studentAsJSON);
    }

    console.log('handleShowStudentDetailsEvent - END');
}


function displayStudentDetails(studentAsJSON)
{
    console.log({studentAsJSON});
    div_show_student_details.innerHTML = `<div class="show-student-details" data-id="${studentAsJSON.id}">
        <p>Student ID (this is just for debugging): ${studentAsJSON.id}</p>
        <p><strong>${studentAsJSON.firstName} ${studentAsJSON.lastName}</strong></p>
        <p>Student birthdate: ${studentAsJSON.birthDate}</p>
    </div>`;
}


async function handleUpdateStudentDetailsEvent(event)
{
    console.log('handleUpdateStudentDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const studentId = event.target.parentElement.getAttribute("data-id");
    const studentAsJSON = await getStudent(studentId);
    console.log({studentAsJSON});
    div_update_student_details.innerHTML =
        `<form id="id_form_update_student_details">
            <input type="hidden" name="id" value="${studentAsJSON.id}">

            <label for="update_first_name">Student First Name</label>
            <input type="text" name="firstName" id="update_first_name" value="${studentAsJSON.firstName}" required>
            <br>

            <label for="update_last_name">Student Last Name</label>
            <input type="text" name="lastName" id="update_last_name" value="${studentAsJSON.lastName}" required>
            <br>

            <label for="update_birth_date">Student Birthdate</label>
            <input type="text" name="birthDate" id="update_birth_date" value="${studentAsJSON.birthDate}" required>
            <br>

            <button type="submit">Update student details</button>
        </form>`;

    const idFormUpdateStudentDetailsElement = document.getElementById("id_form_update_student_details");
    idFormUpdateStudentDetailsElement.addEventListener("submit", function(event)
    {
        event.preventDefault();

        const formData = new FormData(idFormUpdateStudentDetailsElement);
        const studentData =
            {
                id: formData.get("id"),
                firstName: formData.get("firstName"),
                lastName: formData.get("lastName"),
                birthDate: formData.get("birthDate")
            };
        console.log({studentData});
        updateStudent(studentData);
    });

    console.log('handleUpdateStudentDetailsEvent - END');
}


async function handleDeleteStudentEvent(event)
{
    console.log('handleDeleteStudentEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const studentId = event.target.parentElement.getAttribute("data-id");
    await deleteStudent(studentId);
    console.log('handleDeleteStudentEvent - END');
}
