document.addEventListener("DOMContentLoaded", () => {
  //form
  const form = document.getElementById("Signup");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("กรุณากรอกรหัสผ่านให้ตรงกัน");
      }

      if (password == confirmPassword) {
        const newUser = {
          email,
          password,
          role: "user",
        };

        //function
      signUpFunction(newUser);
      }
      
    });
  }

  //function post url
  const signUpFunction = async (data) => {
   try {
    const response = await fetch("http://localhost:3000/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("สมัครสมาชิกเสร็จสิ้น");
      form.reset();
    } else {
        const data = await response.json()
      alert("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้ error : ",data.msg)
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };
});
