export const fetchUserFiles = async () => {
    const response = await fetch('http://localhost:5046/api/Files', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };
  
  export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch('http://localhost:5046/api/Files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // אין צורך להגדיר Content-Type כאשר משתמשים ב-FormData
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  };