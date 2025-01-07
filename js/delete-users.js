function deleteUser(serialNumber) {
  window.userToDelete = serialNumber;
  document.getElementById('delete-popup').style.display = 'block';
  document.getElementById('delete-popup-overlay').style.display = 'block';
}

function confirmDeleteUser() {
  const serialNumber = Number(window.userToDelete);

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Remove the user from the array
  const filteredUsers = users.filter(user => user.serialNumber !== serialNumber);

  if (filteredUsers.length === users.length) {
    showNotification('User not found!', '#dc3545'); // Red for error
    return;
  }

  // Re-assign serial numbers
  filteredUsers.forEach((user, index) => {
    user.serialNumber = 904001 + index;
  });

  // Save the updated users list to localStorage
  localStorage.setItem('users', JSON.stringify(filteredUsers));

  // Update the user list
  try {
    displayUserList(filteredUsers);
  } catch (error) {
    console.error('Error in displayUserList:', error);
  }

  // Update GitHub with the new list
  try {
    updateUserDataOnGitHub(filteredUsers);
  } catch (error) {
    console.error('Error in updateUserDataOnGitHub:', error);
  }

  // Close the delete popup
  closeDeletePopup();

  // Show success notification
  showNotification('User deleted successfully!');
}

function closeDeletePopup() {
  document.getElementById('delete-popup').style.display = 'none';
  document.getElementById('delete-popup-overlay').style.display = 'none';
}

async function updateUserDataOnGitHub(users) {

  try {
    // Fetch the current SHA
    const getResponse = await fetch(qhakl, {
      headers: { Authorization: `token ${token}` }
    });

    if (!getResponse.ok) {
      console.error('Error fetching file metadata:', await getResponse.json());
      return;
    }

    const fileData = await getResponse.json();
    const currentSHA = fileData.sha;

    // Update the file
    const payload = {
      message: 'Update user data',
      content: btoa(JSON.stringify(users)), // Convert to base64
      sha: currentSHA
    };

    const updateResponse = await fetch(qhakl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API error:', errorData);
    } else {
      console.log('Successfully updated data on GitHub:', await updateResponse.json());
    }
  } catch (error) {
    console.error('Error updating data on GitHub:', error);
  }
}

// Notification function
function showNotification(message, color = '#28a745') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.backgroundColor = color;
  notification.style.display = 'block';

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}
