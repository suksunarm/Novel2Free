document.addEventListener("DOMContentLoaded", () => {
  //form
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
      
      signInFunction(login);
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
      formSignup.reset();
    } else {
        const data = await response.json()
      alert("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้ error : "+data.msg)
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };

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
      localStorage.setItem("token"+data.token)
    } else {
      alert("เกิดข้อผิดพลาด ไม่สามารถเข้าสู่ระบบได้")
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };

  //addNovel
  const addNovel = document.getElementById("addNovel");
  if (addNovel) {
    addNovel.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameNovel = document.getElementById("nameNovel").value;
      const contentNovel = document.getElementById("contentNovel").value;
      const priceNovel = document.getElementById("priceNovel").value;

      //เหลือ imgNovel
      const novel = {
        nameNovel,
        contentNovel,
        priceNovel
      }
      
      addNovelFunction(novel);
      
    });
  }

  const addNovelFunction = async (data) => {
   try {
    const response = await fetch("http://localhost:3000/addNovel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("เพิ่มนิยายเสร็จสิ้น");
      addNovel.reset();
    } else {
        const data = await response.json()
      alert("เกิดข้อผิดพลาด ไม่สามารถเพิ่มนิยายได้ error : "+data.msg)
    }
   } catch (err) {
        console.error("เกิดข้อผิดพลาด ",err)
    }
  };

});
