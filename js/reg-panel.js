function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
  }

  document.getElementById('popup-close-btn').addEventListener('click', closePopup);

  const addFieldBtn = document.getElementById('add-field-btn');
  const extraFields = document.getElementById('extra-fields');
  const popupOverlay = document.getElementById('popup-overlay');
  const popupFieldName = document.getElementById('popup-field-name');
  const popupConfirmBtn = document.getElementById('popup-confirm-btn');
  const userSerialDisplay = document.getElementById('user-serial-display');
  let fieldCount = 0;
  const maxFields = 10;
  let currentSerial = 904001;

  addFieldBtn.addEventListener('click', () => {
    if (fieldCount < maxFields) {
      popupFieldName.value = '';
      popupOverlay.style.display = 'flex';
    }
  });

  popupConfirmBtn.addEventListener('click', () => {
    const fieldName = popupFieldName.value.trim();
    if (fieldName) {
      fieldCount++;
      const newField = document.createElement('div');
      newField.classList.add('form-group');
      newField.innerHTML = `
        <label>${fieldName}</label>
        <input type="text" placeholder="Enter ${fieldName}" name="${fieldName}">
      `;
      extraFields.appendChild(newField);
      popupOverlay.style.display = 'none';
      if (fieldCount === maxFields) addFieldBtn.style.display = 'none';
    }
  });

  document.getElementById('control-panel-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    let userData = { serialNumber: currentSerial };

    formData.forEach((value, key) => {
      userData[key] = value;
    });

    const jsonData = JSON.stringify(userData);

    fetch(qhakl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })
      .then(response => response.json())
      .then(data => {
        let sha = data.sha || '';
        let existingData = data.content ? atob(data.content) : '[]';
        let existingUsers = JSON.parse(existingData);

        // Determine the next serial number
        if (existingUsers.length > 0) {
          currentSerial = existingUsers[existingUsers.length - 1].serialNumber + 1;
        } else {
          currentSerial = 904001;
        }

        userData.serialNumber = currentSerial;
        existingUsers.push(userData);

        const updatedData = JSON.stringify(existingUsers);
        updateUserData(updatedData, sha);
      })
      .catch(err => {
        console.error('Error fetching existing file:', err);
        updateUserData(JSON.stringify([userData]));
      });

    function updateUserData(data, sha = '') {
      const message = sha ? 'Updating user data' : 'Creating user data';
      const fileContent = btoa(data);

      fetch(qhakl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          content: fileContent,
          sha: sha,
        }),
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.content) {
            alert('Data saved successfully!');
            displayCurrentData();
            currentSerial++; // Increment after successful save
          } else {
            alert('Failed to save data.');
          }
        })
        .catch(err => {
          console.error('Error saving data:', err);
          alert('An error occurred while saving data.');
        });
    }

    function displayCurrentData() {
      userSerialDisplay.innerHTML = `
        <h3>Current Entry</h3>
        <p>Serial Number: ${currentSerial}</p>
        <pre>${JSON.stringify(userData, null, 2)}</pre>
      `;
    }
  });
