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

// Load saved data from localStorage
function loadData() {
    const saved = localStorage.getItem('chapterRoomData');
    if (saved) {
        userStatuses = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
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
        
        if (!status.inRoom && status.reason) {
            const reason = document.createElement('div');
            reason.className = 'status-reason';
            reason.textContent = `Reason: ${status.reason}`;
            item.appendChild(reason);
        }
        
        statusList.appendChild(item);
    });
}

// Handle name selection
document.getElementById('nameSelect').addEventListener('change', function() {
    const selectedName = this.value;
    const statusGroup = document.getElementById('statusGroup');
    const reasonGroup = document.getElementById('reasonGroup');
    
    if (selectedName) {
        statusGroup.style.display = 'block';
        reasonGroup.style.display = 'none';
        
        // Reset buttons
        document.getElementById('inRoomBtn').classList.remove('active');
        document.getElementById('notInRoomBtn').classList.remove('active');
        document.getElementById('reasonInput').value = '';
        
        // If user already has a status, show it
        if (userStatuses[selectedName]) {
            if (userStatuses[selectedName].inRoom) {
                document.getElementById('inRoomBtn').classList.add('active');
            } else {
                document.getElementById('notInRoomBtn').classList.add('active');
                reasonGroup.style.display = 'block';
                if (userStatuses[selectedName].reason) {
                    document.getElementById('reasonInput').value = userStatuses[selectedName].reason;
                }
            }
        }
    } else {
        statusGroup.style.display = 'none';
        reasonGroup.style.display = 'none';
    }
});

// Handle "In Room" button
document.getElementById('inRoomBtn').addEventListener('click', function() {
    const selectedName = document.getElementById('nameSelect').value;
    if (!selectedName) return;
    
    userStatuses[selectedName] = {
        inRoom: true,
        reason: null
    };
    
    document.getElementById('inRoomBtn').classList.add('active');
    document.getElementById('notInRoomBtn').classList.remove('active');
    document.getElementById('reasonGroup').style.display = 'none';
    
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
document.getElementById('submitReasonBtn').addEventListener('click', function() {
    const selectedName = document.getElementById('nameSelect').value;
    const reason = document.getElementById('reasonInput').value.trim();
    
    if (!selectedName) return;
    
    userStatuses[selectedName] = {
        inRoom: false,
        reason: reason || null
    };
    
    saveData();
    updateCounter();
    updateStatusList();
});

// Initialize the app
loadData();
initializeNameDropdown();
updateCounter();
updateStatusList();
