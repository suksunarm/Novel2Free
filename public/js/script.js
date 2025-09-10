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
      console.log("Form submit triggered");
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

  // Edit Novel
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editNovelForm");
  const closeEditModal = document.getElementById("closeEditModal");

  // ปุ่มเปิด modal
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const novelId = btn.dataset.id;
      try {
        // ดึงข้อมูลนิยายจาก backend
        const response = await fetch(`/admin/novel/${novelId}`);
        if (!response.ok) throw new Error("Failed to fetch novel data");
        const novelData = await response.json();

        // ใส่ข้อมูลลงใน modal
        document.getElementById("editName").value = novelData.title;
        document.getElementById("editContent").value = novelData.content;
        document.getElementById("editPrice").value = novelData.price;
        document.getElementById("editImage").value = novelData.image_url || "";

        // เปิด modal
        editModal.classList.remove("hidden");
        editModal.classList.add("flex");

        // เก็บ novelId ไว้ใน form
        editForm.dataset.novelId = novelId;
      } catch (err) {
        alert("ไม่สามารถดึงข้อมูลนิยายเพื่อแก้ไขได้");
        console.error(err);
      }
    });
  });

  const editNovelFunction = async (novelId, data) => {
    try {
      const response = await fetch(`/admin/novel/${novelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("แก้ไขนิยายเสร็จสิ้น");
        editModal.classList.add("hidden");
        location.reload();
      } else {
        const data = await response.json();
        alert("เกิดข้อผิดพลาด ไม่สามารถแก้ไขนิยายได้ error : " + data.msg);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  // จัดการ form ข้างใน modal (เมื่อกด Save)
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const novelId = editForm.dataset.novelId;
    const editName = document.getElementById("editName").value;
    const editContent = document.getElementById("editContent").value;
    const editPrice = document.getElementById("editPrice").value;
    const editImage = document.getElementById("editImage").value;
    const novel = {
      editName,
      editContent,
      editPrice,
      editImage,
    };
    editNovelFunction(novelId, novel);
  });

  const deleteNovelFunction = async (novelId) => {
    try {
      const response = await fetch(`/admin/novel/${novelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("ลบนิยายเสร็จสิ้น");
        location.reload();
      } else {
        const data = await response.json();
        alert("เกิดข้อผิดพลาด ไม่สามารถลบนิยายได้ error : " + data.msg);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const novelId = btn.dataset.id; // กำหนด data-id ในปุ่ม delete
      if (confirm("คุณต้องการลบนิยายนี้จริงหรือไม่?")) {
        deleteNovelFunction(novelId);
      }
    });
  });

  // ปิด modal
  closeEditModal.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

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
        window.location.href = "/";
      } else {
        alert("เกิดข้อผิดพลาด ไม่สามารถเข้าสู่ระบบได้");
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

  if (token) {
    // If a token exists, show the user icon and hide the sign-in button
    signinBtn.classList.add("hidden");
    userIcon.classList.remove("hidden");
  } else {
    // If no token, show the sign-in button and hide the user icon
    signinBtn.classList.remove("hidden");
    userIcon.classList.add("hidden");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      signinBtn.classList.remove("hidden");
      userIcon.classList.add("hidden");
      // รีเฟรชหน้า หรือ redirect ไปหน้า login ถ้าต้องการ
      // location.reload();
    });
  }
});
