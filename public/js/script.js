document.addEventListener("DOMContentLoaded", () => {
  //Signup
  const formSignup = document.getElementById("Signup");
  if (formSignup) {
    formSignup.addEventListener("submit", (e) => {
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

  //Signin
  const formSignin = document.getElementById("Signin");
  if (formSignin) {
    formSignin.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("emailLogin").value;
      const password = document.getElementById("passwordLogin").value;
    
      const login = {
        email,
        password,
      }
      console.log(login)
      signInFunction(login);
    });
  }

  //function Signup
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
      formSignup.reset();
    } else {
        const data = await response.json()
      alert("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้ error : "+data.msg)
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };

  //function Signin
  const signInFunction = async (data) => {
   try {
    const response = await fetch("http://localhost:3000/login_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("เข้าสู่ระบบเสร็จสิ้น");
      formSignin.reset();
      const data = await response.json()
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert("เกิดข้อผิดพลาด ไม่สามารถเข้าสู่ระบบได้")
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };

  // LOGOUT & Check Token
  const token = localStorage.getItem('token');
  const signinBtn = document.getElementById('signinBtn');
  const userIcon = document.getElementById('userIcon');
  const logoutBtn = document.getElementById('logout');

  if (token) {
      // If a token exists, show the user icon and hide the sign-in button
      signinBtn.classList.add('hidden');
      userIcon.classList.remove('hidden');
  } else {
      // If no token, show the sign-in button and hide the user icon
      signinBtn.classList.remove('hidden');
      userIcon.classList.add('hidden');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      signinBtn.classList.remove('hidden');
      userIcon.classList.add('hidden');
      // รีเฟรชหน้า หรือ redirect ไปหน้า login ถ้าต้องการ
      // location.reload();
    });
  }


});
