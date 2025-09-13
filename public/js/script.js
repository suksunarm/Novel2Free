document.addEventListener("DOMContentLoaded", () => {
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
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เข้าสู่ระบบสำเร็จ!",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = data.redirectPath;
        });
        formSignin.reset();
        const data = await response.json();
        localStorage.setItem("token", data.token);
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง!",
        });
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  //Signup
  const formSignup = document.getElementById("Signup");
  if (formSignup) {
    formSignup.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรอกรหัสผ่านไม่ตรงกัน!",
        });
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
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มนิยายสำเร็จ!",
        });
        addNovel.reset();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `${data.msg}`,
        });
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
      const pointsCoupon = parseInt(
        document.getElementById("pointsCoupon").value
      );

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
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สมัครสมาชิกสำเร็จ!",
        });
        formSignup.reset();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: `${data.msg}`,
        });
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  const logoutFunction = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ไม่สามารถลบคุกกี้ได้", err);
    }
  };

  //function Add Coupon
  const addRedeemCodeFunction = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:3000/admin/add-Redeem-Code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มคูปองสำเร็จ!",
        });
        addRedeemCode.reset();
        const data = await response.json();
        console.log(data.copon);
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: `${data.msg}`,
        });
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
      logoutBtn.classList.add("hidden");
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      console.log("Logout clicked");
      localStorage.removeItem("token");
      await logoutFunction();
      window.location.href = "/";
      signinBtn.classList.remove("hidden");
      userIcon.classList.add("hidden");
      // รีเฟรชหน้า หรือ redirect ไปหน้า login ถ้าต้องการ
      // location.reload();
    });
  }

  if (logoutAdmin) {
    logoutAdmin.addEventListener("click", async () => {
      localStorage.removeItem("token");
      await logoutFunction();
      window.location.href = "/";
      console.log("ออกจากระบบ");
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
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลนิยายเพื่อแก้ไขได้!",
        });
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
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "แก้ไขนิยายสำเร็จ!",
        });
        editModal.classList.add("hidden");
        location.reload();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: `${data.msg}`,
        });
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  // จัดการ form ข้างใน modal (เมื่อกด Save)
  if (editForm) {
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
  }

  const deleteNovelFunction = async (novelId) => {
    try {
      const response = await fetch(`/admin/novel/${novelId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ลบนิยายสำเร็จ!",
        });
        location.reload();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: `${data.msg}`,
        });
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด ", err);
    }
  };

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const novelId = btn.dataset.id; // กำหนด data-id ในปุ่ม delete
      if (confirm("คุณต้องการลบนิยายนี้จริงหรือไม่?")) {
        deleteNovelFunction(novelId);
      }
    });
  });

  // ปิด modal
  if (closeEditModal) {
    closeEditModal.addEventListener("click", () => {
      editModal.classList.add("hidden");
    });
  }

  //ตะกร้า
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      const novelId = addToCartBtn.dataset.id;
      console.log(novelId);

      try {
        const res = await fetch(
          `http://localhost:3000/add-novel-in-cart/${novelId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // ส่ง cookie JWT ไปด้วย
            body: JSON.stringify({ novelId }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "เพิ่มเข้าตะกร้าเรียบร้อย!",
            text: data.msg,
            confirmButtonText: "ตกลง",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: data.msg || "ไม่สามารถเพิ่มเข้าตะกร้าได้",
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: err.message,
          confirmButtonText: "ตกลง",
        });
      }
    });
  }

  const cartContainer = document.querySelector("#cart-container");
  const cartItems = document.querySelector("#cart_items");
  const cartSubPrice = document.querySelector("#cart_subPrice");
  const cartPrice = document.querySelector("#cart_price");

  document.querySelectorAll(".deleteCart-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const cartItemId = btn.dataset.id;

      try {
        const res = await fetch(`/cart/remove/${cartItemId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          const data = await res.json();
          btn.closest(".cart-item").remove(); // ลบ DOM element

          cartItems.textContent = `${data.totalItems}`;
          cartSubPrice.textContent = `฿${data.totalPrice}`;
          cartPrice.textContent = `฿${data.totalPrice}`;

          if (data.totalItems === 0 && cartContainer) {
            cartContainer.innerHTML = `
              <div class="p-10 text-center">
                <span class="text-6xl mb-4 block">🛒</span>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p class="text-gray-600 mb-6">Looks like you haven't added any novel yet.</p>
                <a href="/" class="inline-block bg-gradient-to-r from-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:scale-105">
                  Browse Novel
                </a>
              </div>`;
          }

          Swal.fire("ลบแล้ว!", "ไอเท็มถูกลบจากตะกร้า", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบไอเท็มได้", "error");
      }
    });
  });
});

async function addPoint(point) {
  try {
    const res = await fetch("http://localhost:3000/addPoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ point }),
    });

    const data = await res.json();

    if (res.ok) {
      // อัปเดต DOM แบบเรียลไทม์ ไม่ต้อง reload
      const pointDisplay = document.getElementById("pointValue");
      if (pointDisplay) {
        pointDisplay.textContent = "My Point : " + data.points;
      }
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: `${data.msg} +${point} Points`,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: `${data.msg}`,
      });
    }
  } catch (err) {
    console.error("เติมพอยท์ล้มเหลว ", err);
  }
}
