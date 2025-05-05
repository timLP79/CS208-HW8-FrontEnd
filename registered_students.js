// registered_students.js
console.log('registered_students.js is executing...');

addEventListener('DOMContentLoaded', getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown);
addEventListener('DOMContentLoaded', getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown);

const id_form_add_student_to_class = document.getElementById("id_form_add_student_to_a_class");
id_form_add_student_to_class.addEventListener('submit', handleRegisterStudentEvent);
const div_add_student_to_class = document.getElementById("add_student_to_class");
const div_list_all_registered_students = document.getElementById("list_all_registered_students");
const div_drop_student_from_class = document.getElementById("drop_student_from_class");

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown() {
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try {
        const response = await fetch(API_URL);
        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfClassesAsJSON = await response.json();
            console.log({ listOfClassesAsJSON });
            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        } else {
            console.error("Failed to retrieve the classes");
            showClassError(
                `ERROR: Failed to retrieve classes (status ${response.status})`
            );
        }
    } catch (error) {
        console.error(error);
        showClassError(
            "ERROR: Could not connect to the API to fetch the classes data"
        );
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}

function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON) {
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // clear any stale error messages
    clearClassError();

    // delete all existing options
    while (selectClassForEnrollment.firstChild) {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const placeholder = document.createElement("option");
    placeholder.value    = "";
    placeholder.text     = "Select a class";
    placeholder.disabled = true;
    placeholder.selected = true;
    selectClassForEnrollment.appendChild(placeholder);

    for (const classAsJSON of listOfClassesAsJSON) {
        const option = document.createElement("option");
        option.value = classAsJSON.id;
        option.text  = `${classAsJSON.code}: ${classAsJSON.title}`;
        selectClassForEnrollment.appendChild(option);
    }
}

// ----------------------------
// Helpers for class-load errors
// ----------------------------
function showClassError(message) {
    clearClassError();
    const select = document.getElementById("selectClassForEnrollment");
    const errP = document.createElement("p");
    errP.className   = "failure";
    errP.textContent = message;
    select.parentElement.appendChild(errP);
}

function clearClassError() {
    const parent = document.getElementById("selectClassForEnrollment").parentElement;
    const old = parent.querySelector("p.failure");
    if (old) parent.removeChild(old);
}


// ---------------------------------------------------------------------------
// Students: Fetch all and refresh the student-dropdown (same programming style)
// ---------------------------------------------------------------------------
async function getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown() {
    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/students";

    try {
        const response = await fetch(API_URL);
        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfStudentsAsJSON = await response.json();
            console.log({ listOfStudentsAsJSON });
            refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON);
        } else {
            console.error("Failed to retrieve the students");
            showStudentError(
                `ERROR: Failed to retrieve students (status ${response.status})`
            );
        }
    } catch (error) {
        console.error(error);
        showStudentError(
            "ERROR: Could not connect to the API to fetch the students data"
        );
    }

    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - END');
}

function refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON) {
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    // clear any stale error messages
    clearStudentError();

    // delete all existing options
    while (selectStudentForEnrollment.firstChild) {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const placeholder = document.createElement("option");
    placeholder.value    = "";
    placeholder.text     = "Select a student";
    placeholder.disabled = true;
    placeholder.selected = true;
    selectStudentForEnrollment.appendChild(placeholder);

    for (const studentAsJSON of listOfStudentsAsJSON) {
        const option = document.createElement("option");
        option.value = studentAsJSON.id;
        option.text  = `${studentAsJSON.firstName} ${studentAsJSON.lastName}`;
        selectStudentForEnrollment.appendChild(option);
    }
}

// ----------------------------
// Helpers for student-load errors
// ----------------------------
function showStudentError(message) {
    clearStudentError();
    const select = document.getElementById("selectStudentForEnrollment");
    const errP = document.createElement("p");
    errP.className   = "failure";
    errP.textContent = message;
    select.parentElement.appendChild(errP);
}

function clearStudentError() {
    const parent = document.getElementById("selectStudentForEnrollment").parentElement;
    const old = parent.querySelector("p.failure");
    if (old) parent.removeChild(old);
}

async function getAndDisplayAllRegisteredStudents()
{
    console.log('getAndDisplayAllRegisteredStudents - START');

    const API_URL = "http://localhost:8080/registered_students";

    div_list_all_registered_students.innerHTML = "Calling the API to get the list of registered students...";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_list_all_registered_students.innerHTML = "Retrieved the registered students successfully, now we just need to process them...";

            const listOfRegisteredStudentsAsJSON = await response.json();
            console.log({listOfRegisteredStudents: listOfRegisteredStudentsAsJSON});

            displayRegisteredStudents(listOfRegisteredStudentsAsJSON);
        }
        else
        {
            div_list_all_registered_students.innerHTML = '<p class="failure">ERROR: failed to retrieve the students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_list_all_registered_students.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the student data.</p>';
    }

    console.log('getAndDisplayAllRegisteredStudents - END');
}

function displayRegisteredStudents(listOfRegisteredStudentsAsJSON)
{
    div_list_all_registered_students.innerHTML = '';

    for (const registeredStudentAsJSON of listOfRegisteredStudentsAsJSON)
    {
        console.log({registeredStudentAsJSON});
        div_list_all_registered_students.innerHTML += renderRegisteredStudentAsHTML(registeredStudentAsJSON);
    }
}

function renderRegisteredStudentAsHTML(registeredStudentAsJSON)
{
    // data-id is a custom attribute that we use to store the id of the student, so that we can retrieve it later
    // when the user clicks on the "Show Student Details" button, or the "Update Student Details" button, or the "Delete Student" button

    return `<div class="show-student-in-list" data-id="${registeredStudentAsJSON.studentId}">
        <p>Student ID (this is just for debugging): ${registeredStudentAsJSON.studentId}</p>
        <p>Student Full Name: ${registeredStudentAsJSON.studentFullName}</p>
        <p>Class Code: ${registeredStudentAsJSON.code}</p>
        <p>Class Title: ${registeredStudentAsJSON.title}</p>
        <p>
            <!-- TODO: this is for extra credit -->
            <a href="students.show.html?student_id=${registeredStudentAsJSON.id}">Show this student</a>
        </p>
        <!--<button onclick="handleShowStudentDetailsEvent(event)">Show Student Details</button>
        <button onclick="handleUpdateStudentDetailsEvent(event)">Update Student Details</button>-->
       <button
          onclick='dropStudentFromClass({
            studentId: ${registeredStudentAsJSON.studentId},
            classId:   ${registeredStudentAsJSON.classId}
          })'>Drop Student From Class</button>
    </div>`;
}

async function handleRegisterStudentEvent(event)
{
    // Prevent the default form submission behavior which will cause the page to be redirected to the action URL
    event.preventDefault();

    const formData = new FormData(id_form_add_student_to_class);
    const studentAndClassData =
        {
            studentId: formData.get("studentId"),
            classId: formData.get("classId"),
        };
    console.log({studentAndClassData});
    await addStudentToClass(studentAndClassData);
}

async function addStudentToClass(studentAndClassData)
{
    const API_URL = 'http://localhost:8080/add_student_to_class';

    try
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentAndClassData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const registeredStudent = await response.json();
            div_add_student_to_class.innerHTML = `<p class="success">Student registered successfully. The registered student id is ${registeredStudent}</p>`;
            //await getAndDisplayAllRegisteredStudents();
        }
        else
        {
            div_add_student_to_class.innerHTML = '<p class="failure">ERROR: failed to create the new student</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_add_student_to_class.innerHTML = `<p class="failure">ERROR: failed to connect to the API to create the new student</p>`;
    }
}

async function dropStudentFromClass(studentAndClassData) {
    console.log('dropStudentFromClass - START', studentAndClassData);

    const API_URL = 'http://localhost:8080/drop_student_from_class';

    try {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                studentId: studentAndClassData.studentId,
                classId:   studentAndClassData.classId
            })
        });

        console.log({ response });
        console.log(`status = ${response.status}`, response.statusText);

        if (response.ok) {
            div_drop_student_from_class.innerHTML = `
              <p class="success">
                Dropped student ${studentAndClassData.studentId}
                from class ${studentAndClassData.classId} successfully.
              </p>`;
            // refresh the list so the dropped enrollment disappears
            await getAndDisplayAllRegisteredStudents();
        } else {
            div_drop_student_from_class.innerHTML = `
              <p class="failure">
                ERROR: failed to drop the student (status ${response.status})
              </p>`;
        }
    } catch (err) {
        console.error(err);
        div_drop_student_from_class.innerHTML = `
          <p class="failure">
            ERROR: could not connect to the API to drop the student
          </p>`;
    }

    console.log('dropStudentFromClass - END');
}
