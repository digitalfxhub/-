function searchUsers() {
  const searchValue = document.getElementById('search-bar').value.toLowerCase();
  const users = JSON.parse(localStorage.getItem('users'));

  const filteredUsers = users.filter(user => {
    const name = user.full_name.toLowerCase();
    const mobile = user.mobile ? user.mobile.toLowerCase() : ''; // Handle missing mobile field
    return name.includes(searchValue) || mobile.includes(searchValue);
  });

  displayUserList(filteredUsers); // Use existing function to update the table
}
