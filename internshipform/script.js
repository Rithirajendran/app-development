// FORM & SCREEN REFERENCES
const form = document.getElementById("regForm");
const formCard = document.getElementById("formCard");
const detailsCard = document.getElementById("detailsCard");
const detailsBox = document.getElementById("detailsBox");

// CLEAR ALL ERRORS
function clearErrors() {
    document.querySelectorAll(".error").forEach(err => err.textContent = "");
}

// SHOW ERROR BELOW INPUT
function showError(id, message) {
    document.getElementById(id)
        .parentElement
        .querySelector(".error").textContent = message;
}

// FORM SUBMIT
form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // GET VALUES
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const department = document.getElementById("department").value;
    const gender = document.querySelector('input[name="gender"]:checked');

   // NAME VALIDATION
if (name === "" || /\d/.test(name)) {  // checks if name contains any digit
    showError("name", "Please enter a valid name (no numbers allowed)");
    isValid = false;
}

// COLLEGE NAME VALIDATION
if (college === "" || /\d/.test(college)) {  // checks if college name contains any digit
    showError("college", "Please enter a valid college name (no numbers allowed)");
    isValid = false;
}

// AGE VALIDATION
if (age === "" || age < 18 || age > 60) {
    showError("age", "Age must be between 18 and 60");
    isValid = false;
}

// GENDER VALIDATION
if (!gender) {
    document.querySelector(".gender-box .error").textContent = "Please select gender";
    isValid = false;
}

// EMAIL VALIDATION
if (email === "" || !email.includes("@") || !email.includes(".")) {
    showError("email", "Please enter a valid email");
    isValid = false;
}

// PASSWORD VALIDATION
if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    showError("password", "Password must be 8 characters with number & special character");
    isValid = false;
}

// DEPARTMENT VALIDATION (readonly or fixed field)
if (department === "" || department == null) {
    showError("department", "Department is required");
    isValid = false;
}


    // IF ANY ERROR → STOP
    if (!isValid) return;

    // SHOW DETAILS (WITHOUT PASSWORD)
    detailsBox.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Gender:</strong> ${gender.value}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${department}</p>
    `;

    // SWITCH SCREEN
    formCard.classList.add("hidden");
    detailsCard.classList.remove("hidden");
});




