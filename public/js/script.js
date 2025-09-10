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
      };

      signInFunction(login);
    });
  }

  const addNovelFunction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/admin/addNovel", {
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
        const data = await response.json();
        alert("เกิดข้อผิดพลาด ไม่สามารถเพิ่มนิยายได้ error : " + data.msg);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  //addNovel
  const addNovel = document.getElementById("addNovel");
  if (addNovel) {
    addNovel.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameNovel = document.getElementById("nameNovel").value;
      const contentNovel = document.getElementById("contentNovel").value;
      const priceNovel = parseInt(document.getElementById("priceNovel").value);
      const imgNovel = document.getElementById("imageNovel").value;

      //เหลือ imgNovel
      const novel = {
        nameNovel,
        contentNovel,
        imgNovel,
        priceNovel,
      };
      addNovelFunction(novel);
    });
  }

  const addRedeemCode = document.getElementById("addRedeemCode");
  if (addRedeemCode) {
    addRedeemCode.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameCoupon = document.getElementById("nameCoupon").value;
      const codeCoupon = document.getElementById("codeCoupon").value;
      const pointsCoupon = parseInt(document.getElementById("pointsCoupon").value);

      //เหลือ imgNovel
      const redeemCode = {
        nameCoupon,
        codeCoupon,
        pointsCoupon,
      };
      addRedeemCodeFunction(redeemCode);
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
        const data = await response.json();
        alert("เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้ error : " + data.msg);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
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
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = data.redirectPath;
      } else {
        alert("เกิดข้อผิดพลาด ไม่สามารถเข้าสู่ระบบได้");
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  const logoutFunction = () => {
    try {
      const response = fetch("http://localhost:3000/logout", {
        method: "GET",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ไม่สามารถลบคุกกี้ได้", err);
    }
  };

  //function Add Coupon
  const addRedeemCodeFunction = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/admin/add-Redeem-Code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("เพิ่มคูปองสำเร็จ!");
        addRedeemCode.reset();
        const data = await response.json();
        console.log(data.copon)
      } else {
        const data = await response.json();
        alert("เกิดข้อผิดพลาด ไม่สามารถเพิ่ม Coupon ได้: " + data.msg);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  // LOGOUT & Check Token
  const token = localStorage.getItem("token");
  const signinBtn = document.getElementById("signinBtn");
  const userIcon = document.getElementById("userIcon");
  const logoutBtn = document.getElementById("logout");
  const logoutAdmin = document.getElementById("logoutAdmin");

  if (signinBtn && userIcon) {
    if (token) {
      signinBtn.classList.add("hidden");
      userIcon.classList.remove("hidden");
    } else {
      signinBtn.classList.remove("hidden");
      userIcon.classList.add("hidden");
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      signinBtn.classList.remove("hidden");
      userIcon.classList.add("hidden");
      // รีเฟรชหน้า หรือ redirect ไปหน้า login ถ้าต้องการ
      // location.reload();
      logoutFunction();
    });
  }

  if (logoutAdmin) {
    logoutAdmin.addEventListener("click", () => {
      localStorage.removeItem("token");
      logoutFunction();
      window.location.href = "/signin";
      console.log("ออกจากระบบ");
    });
  }
});
