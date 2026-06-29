const API_URL = "http://localhost:5000/api/leaves";

const leaveContainer = document.getElementById("leaveContainer");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const approvedCount = document.getElementById("approvedCount");
const rejectedCount = document.getElementById("rejectedCount");


// ---------------- DATE ----------------

document.getElementById("currentDate").innerText =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// ---------------- LOAD DASHBOARD ----------------

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        const leaves = result.data;

        updateStatistics(leaves);

        displayPendingLeaves(leaves);

    }

    catch (error) {

        console.error(error);

    }

}


// ---------------- STATISTICS ----------------

function updateStatistics(leaves) {

    totalCount.innerText = leaves.length;

    pendingCount.innerText =
        leaves.filter(l => l.status === "Pending").length;

    approvedCount.innerText =
        leaves.filter(l => l.status === "Approved").length;

    rejectedCount.innerText =
        leaves.filter(l => l.status === "Rejected").length;

}



// ---------------- DISPLAY PENDING REQUESTS ----------------

function displayPendingLeaves(leaves) {

    leaveContainer.innerHTML = "";

    const pendingLeaves = leaves.filter(
        leave => leave.status === "Pending"
    );

    if (pendingLeaves.length === 0) {

        leaveContainer.innerHTML =
            "<p>No pending leave requests.</p>";

        return;

    }

    pendingLeaves.forEach(leave => {

        const card = document.createElement("div");

        card.className = "leave-card";

        card.innerHTML = `

        <div class="card-top">

            <div>

                <div class="employee-name">

                    ${leave.employeeName}

                </div>

                <small>

                    ${leave.department}

                </small>

            </div>

            <div class="leave-type">

                ${leave.leaveType}

            </div>

        </div>


        <div class="card-details">

            <div class="detail">

                <span>Employee ID</span>

                <p>${leave.employeeId}</p>

            </div>

            <div class="detail">

                <span>Leave ID</span>

                <p>${leave.leaveId}</p>

            </div>

            <div class="detail">

                <span>From</span>

                <p>${formatDate(leave.fromDate)}</p>

            </div>

            <div class="detail">

                <span>To</span>

                <p>${formatDate(leave.toDate)}</p>

            </div>

        </div>


        <div class="reason">

            <strong>Reason</strong>

            <p>

                ${leave.reason}

            </p>

        </div>


        <div class="actions">

            <button
                class="approve-btn"
                onclick="approveLeave('${leave._id}')">

                Approve

            </button>

            <button
                class="reject-btn"
                onclick="rejectLeave('${leave._id}')">

                Reject

            </button>

        </div>

        `;

        leaveContainer.appendChild(card);

    });

}



// ---------------- APPROVE ----------------

async function approveLeave(id) {

    await fetch(`${API_URL}/${id}/approve`, {

        method: "PUT"

    });

    loadDashboard();

}



// ---------------- REJECT ----------------

async function rejectLeave(id) {

    await fetch(`${API_URL}/${id}/reject`, {

        method: "PUT"

    });

    loadDashboard();

}



// ---------------- FORMAT DATE ----------------

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}



// ---------------- START ----------------

loadDashboard();