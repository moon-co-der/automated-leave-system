const API_URL = "https://automated-leave-system.vercel.app/api/leaves";

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


// ---------------- MODAL STATE ----------------

let pendingLeaveId = null;


// ---------------- MODAL HELPERS ----------------

function openModal(modalId) {
    document.getElementById(modalId).classList.add("open");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("open");
    if (modalId === "approveModal") {
        document.getElementById("approveReason").value = "";
    }
    if (modalId === "rejectModal") {
        document.getElementById("rejectReason").value = "";
        document.getElementById("rejectReasonError").style.display = "none";
    }
}


// ---------------- TOAST ----------------

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);

}


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

        const isPending = leave.status === "Pending";

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
                id="approve-${leave._id}"
                onclick="openApproveModal('${leave._id}')"
                ${!isPending ? "disabled" : ""}>

                Approve

            </button>

            <button
                class="reject-btn"
                id="reject-${leave._id}"
                onclick="openRejectModal('${leave._id}')"
                ${!isPending ? "disabled" : ""}>

                Reject

            </button>

        </div>

        `;

        leaveContainer.appendChild(card);

    });

}



// ---------------- OPEN APPROVE MODAL ----------------

function openApproveModal(id) {
    pendingLeaveId = id;
    document.getElementById("approveReason").value = "";
    openModal("approveModal");
}


// ---------------- OPEN REJECT MODAL ----------------

function openRejectModal(id) {
    pendingLeaveId = id;
    document.getElementById("rejectReason").value = "";
    document.getElementById("rejectReasonError").style.display = "none";
    openModal("rejectModal");
}


// ---------------- CONFIRM APPROVE ----------------

async function confirmApprove() {

    const managerReason = document.getElementById("approveReason").value.trim();

    closeModal("approveModal");

    try {

        console.log("Approving leave ID:", pendingLeaveId, "via", `${API_URL}/${pendingLeaveId}/approve`);
        console.log("Approval managerReason:", managerReason);

        const response = await fetch(`${API_URL}/${pendingLeaveId}/approve`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ managerReason })

        });

        console.log("Approve response status:", response.status);

        const result = await response.json();

        console.log("Approve response body:", result);

        if (result.success) {
            showToast("✅ Leave approved successfully!", "success");
        } else {
            showToast("❌ Failed to approve leave.", "error");
        }

    } catch (error) {

        console.error(error);
        showToast("❌ Something went wrong.", "error");

    }

    loadDashboard();

}


// ---------------- CONFIRM REJECT ----------------

async function confirmReject() {

    const managerReason = document.getElementById("rejectReason").value.trim();

    if (!managerReason) {
        document.getElementById("rejectReasonError").style.display = "block";
        return;
    }

    closeModal("rejectModal");

    try {

        const response = await fetch(`${API_URL}/${pendingLeaveId}/reject`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ managerReason })

        });

        const result = await response.json();

        if (result.success) {
            showToast("🚫 Leave rejected.", "success");
        } else {
            showToast("❌ Failed to reject leave.", "error");
        }

    } catch (error) {

        console.error(error);
        showToast("❌ Something went wrong.", "error");

    }

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