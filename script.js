// List of names (excluding Arya Shadan, adding requested names)
const names = [
    "DJ",
    "Joshua Koo",
    "Jackson Zane",
    "Nirvaan Somany",
    "Ose Okhihan",
    "Quinn Simmons",
    "Alex Nania",
    "Barrow Solomon",
    "Ben Manning",
    "Bobby McAdams",
    "Callen Bronson",
    "Danny Hagenlocker",
    "Drew Cunningham",
    "Gabe George",
    "Garner Duncan",
    "Hudson Addams",
    "Ilan Arias",
    "Justin Huebner",
    "Lucas Gravina",
    "Moritz Schreyogg",
    "Owen Rowe",
    "Patty Holden",
    "Pierce Gurtner",
    "Reid Hammer",
    "Sawyer Rogoff",
    "Tommy McComb",
    "Wiley Kendall",
    "Will Charouhis",
    "Will Reem"
].sort();

// Minimum people needed in chapter room (dynamic based on time)
function getMinimumNeeded() {
    const now = new Date();
    const hour = now.getHours();
    
    // Between 9 PM (21:00) and 9 AM (09:00) requires 20 people
    // Otherwise requires 13 people
    if (hour >= 21 || hour < 9) {
        return 20;
    } else {
        return 13;
    }
}

// Store user statuses
let userStatuses = {};

// API base URL - change this when deploying
const API_URL = window.location.origin;

// Load saved data from server
async function loadData() {
    try {
        const response = await fetch(`${API_URL}/api/statuses`);
        if (response.ok) {
            userStatuses = await response.json();
            updateCounter();
            updateStatusList();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage if server is unavailable
        const saved = localStorage.getItem('chapterRoomData');
        if (saved) {
            userStatuses = JSON.parse(saved);
        }
    }
}

// Save data to server
async function saveData() {
    // Also save to localStorage as backup
    localStorage.setItem('chapterRoomData', JSON.stringify(userStatuses));
}

// Initialize the name dropdown
function initializeNameDropdown() {
    const select = document.getElementById('nameSelect');
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

// Format time from 24-hour to 12-hour format
function formatTime(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Update the counter
function updateCounter() {
    const count = Object.values(userStatuses).filter(status => status.inRoom).length;
    document.getElementById('counterNumber').textContent = count;
    
    const minimumNeeded = getMinimumNeeded();
    const neededMessage = document.getElementById('neededMessage');
    if (count < minimumNeeded) {
        const needed = minimumNeeded - count;
        neededMessage.textContent = `Need ${needed} more ${needed === 1 ? 'person' : 'people'}`;
    } else {
        neededMessage.textContent = '✓ Minimum reached!';
    }
}

// Update the status list
function updateStatusList() {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';
    
    // Sort by status (in room first) then by name
    const sortedEntries = Object.entries(userStatuses).sort((a, b) => {
        if (a[1].inRoom === b[1].inRoom) {
            return a[0].localeCompare(b[0]);
        }
        return a[1].inRoom ? -1 : 1;
    });
    
    if (sortedEntries.length === 0) {
        statusList.innerHTML = '<p style="color: #999; text-align: center;">No one has checked in yet</p>';
        return;
    }
    
    sortedEntries.forEach(([name, status]) => {
        const item = document.createElement('div');
        item.className = `status-item ${status.inRoom ? 'in-room' : 'not-in-room'}`;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'status-name';
        nameSpan.textContent = name;
        
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.textContent = status.inRoom ? 'In Room' : 'Not In Room';
        
        item.appendChild(nameSpan);
        item.appendChild(badge);
        
        if (status.inRoom && status.leaveTime) {
            const leaveTime = document.createElement('div');
            leaveTime.className = 'status-reason';
            leaveTime.textContent = `Leaving at: ${formatTime(status.leaveTime)}`;
            item.appendChild(leaveTime);
        }
        
        if (!status.inRoom) {
            if (status.arrivalTime) {
                const arrivalTime = document.createElement('div');
                arrivalTime.className = 'status-reason';
                arrivalTime.textContent = `Can come at: ${formatTime(status.arrivalTime)}`;
                item.appendChild(arrivalTime);
            }
            if (status.reason) {
                const reason = document.createElement('div');
                reason.className = 'status-reason';
                reason.textContent = `Reason: ${status.reason}`;
                item.appendChild(reason);
            }
        }
        
        statusList.appendChild(item);
    });
}

// Handle name selection
document.getElementById('nameSelect').addEventListener('change', function() {
    const selectedName = this.value;
    const statusGroup = document.getElementById('statusGroup');
    const leaveTimeGroup = document.getElementById('leaveTimeGroup');
    const reasonGroup = document.getElementById('reasonGroup');
    
    if (selectedName) {
        statusGroup.style.display = 'block';
        leaveTimeGroup.style.display = 'none';
        reasonGroup.style.display = 'none';
        
        // Reset buttons and inputs
        document.getElementById('inRoomBtn').classList.remove('active');
        document.getElementById('notInRoomBtn').classList.remove('active');
        document.getElementById('reasonInput').value = '';
        document.getElementById('leaveTimeInput').value = '';
        document.getElementById('arrivalTimeInput').value = '';
        
        // If user already has a status, show it
        if (userStatuses[selectedName]) {
            if (userStatuses[selectedName].inRoom) {
                document.getElementById('inRoomBtn').classList.add('active');
                leaveTimeGroup.style.display = 'block';
                if (userStatuses[selectedName].leaveTime) {
                    document.getElementById('leaveTimeInput').value = userStatuses[selectedName].leaveTime;
                }
            } else {
                document.getElementById('notInRoomBtn').classList.add('active');
                reasonGroup.style.display = 'block';
                if (userStatuses[selectedName].arrivalTime) {
                    document.getElementById('arrivalTimeInput').value = userStatuses[selectedName].arrivalTime;
                }
                if (userStatuses[selectedName].reason) {
                    document.getElementById('reasonInput').value = userStatuses[selectedName].reason;
                }
            }
        }
    } else {
        statusGroup.style.display = 'none';
        leaveTimeGroup.style.display = 'none';
        reasonGroup.style.display = 'none';
    }
});

// Handle "In Room" button
document.getElementById('inRoomBtn').addEventListener('click', function() {
    const selectedName = document.getElementById('nameSelect').value;
    if (!selectedName) return;
    
    document.getElementById('inRoomBtn').classList.add('active');
    document.getElementById('notInRoomBtn').classList.remove('active');
    document.getElementById('leaveTimeGroup').style.display = 'block';
    document.getElementById('reasonGroup').style.display = 'none';
});

// Handle "In Room" submission with leave time
document.getElementById('submitInRoomBtn').addEventListener('click', async function() {
    const selectedName = document.getElementById('nameSelect').value;
    const leaveTime = document.getElementById('leaveTimeInput').value;
    
    if (!selectedName) return;
    
    const status = {
        inRoom: true,
        leaveTime: leaveTime || null,
        arrivalTime: null,
        reason: null
    };
    
    userStatuses[selectedName] = status;
    
    // Save to server
    try {
        await fetch(`${API_URL}/api/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedName, status })
        });
    } catch (error) {
        console.error('Error saving to server:', error);
    }
    
    saveData();
    updateCounter();
    updateStatusList();
});

// Handle "Not In Room" button
document.getElementById('notInRoomBtn').addEventListener('click', function() {
    const selectedName = document.getElementById('nameSelect').value;
    if (!selectedName) return;
    
    document.getElementById('inRoomBtn').classList.remove('active');
    document.getElementById('notInRoomBtn').classList.add('active');
    document.getElementById('reasonGroup').style.display = 'block';
});

// Handle reason submission
document.getElementById('submitReasonBtn').addEventListener('click', async function() {
    const selectedName = document.getElementById('nameSelect').value;
    const arrivalTime = document.getElementById('arrivalTimeInput').value;
    const reason = document.getElementById('reasonInput').value.trim();
    
    if (!selectedName) return;
    
    const status = {
        inRoom: false,
        arrivalTime: arrivalTime || null,
        reason: reason || null,
        leaveTime: null
    };
    
    userStatuses[selectedName] = status;
    
    // Save to server
    try {
        await fetch(`${API_URL}/api/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedName, status })
        });
    } catch (error) {
        console.error('Error saving to server:', error);
    }
    
    saveData();
    updateCounter();
    updateStatusList();
});

// Auto-refresh data every 5 seconds to sync across devices
setInterval(async () => {
    await loadData();
}, 5000);

// Initialize the app
loadData();
initializeNameDropdown();
updateCounter();
updateStatusList();
