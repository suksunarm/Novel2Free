document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const closeBtn = document.getElementById("closeLoginModal");
  const signinBtn = document.getElementById("signinBtn");

  if (signinBtn) {
    signinBtn.addEventListener("click", () => {
      loginModal.classList.remove("hidden");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });
  }
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
      const categoryNovel = document.getElementById("categoryNovel").value;
      console.log(categoryNovel);

      //เหลือ imgNovel
      const novel = {
        nameNovel,
        contentNovel,
        imgNovel,
        priceNovel,
        categoryNovel,
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

  const userIcon = document.getElementById("userIcon");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logout");

  // Toggle dropdown เมื่อคลิกที่ user icon
  if (userIcon && userDropdown) {
    userIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });

    // ซ่อน dropdown เมื่อคลิกที่อื่น
    document.addEventListener("click", () => {
      userDropdown.classList.add("hidden");
    });

    // ป้องกัน dropdown ปิดเมื่อคลิกข้างใน
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // ออกจากระบบจาก dropdown
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      localStorage.removeItem("token");
      await logoutFunction();
      window.location.href = "/";
    });
  }

  // LOGOUT & Check Token
  const token = localStorage.getItem("token");
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
          }).then(() => {
            window.location.href = "/";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: data.msg,
            confirmButtonText: "ตกลง",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: err.msg,
          confirmButtonText: "ตกลง",
        });
      }
    });
  }

 const favBtn = document.getElementById("addToFavoriteBtn");
  const heartIcon = document.getElementById("heartIcon");
  if (favBtn && heartIcon) {
    favBtn.addEventListener("click", async () => {
      const novelId = favBtn.dataset.id;
      const isRed = heartIcon.getAttribute("fill") === "red";
      try {
        let res, data;
        if (!isRed) {
          res = await fetch(`/add-novel-in-favorite/${novelId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ novelId }),
          });
          data = await res.json();
          if (res.ok) {
            heartIcon.setAttribute("fill", "red");
            heartIcon.setAttribute("stroke", "red");
            Swal.fire("เพิ่มเข้ารายการโปรดเรียบร้อย!", data.msg, "success");
          } else {
            Swal.fire("ผิดพลาด", data.msg, "error");
          }
        } else {
          res = await fetch(`/remove-novel-from-favorite/${novelId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          data = await res.json();
          if (res.ok) {
            heartIcon.setAttribute("fill", "none");
            heartIcon.setAttribute("stroke", "currentColor");

          } else {
            Swal.fire("ผิดพลาด", data.msg, "error");
          }
        }
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
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

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/cart/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ส่ง cookie JWT ไปด้วย
        });
        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "ซื้อสำเร็จ!",
            text: data.msg,
            confirmButtonText: "ตกลง",
          }).then(() => {
            window.location.reload(); // รีเฟรชหน้า cart
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: data.msg || "ซื้อไม่สำเร็จ",
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
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    loadFavorites();
}});
  
});

async function addPoint(point , price) {
  const phone = "0803371641";
  const priceFloat = parseFloat(price);

  // 1. สร้าง QR code ก่อน
  const res = await fetch("http://localhost:3000/generate-promptpay-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, amount: priceFloat }),
  });
  const data = await res.json();

  // 2. แสดง Swal พร้อม QR code
  Swal.fire({
    title: "ชำระเงินด้วย PromptPay",
    html: `
    <img src="${data.qrDataUrl}" 
         alt="PromptPay QR" 
         class="w-56 h-56 mx-auto mb-4" />
    <div class="text-center text-lg font-semibold">
      ยอดชำระ: <b>${priceFloat}</b> บาท
    </div>
  `,
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    focusConfirm: false,
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      // 3. ถ้ากดตกลง ให้เติม point จริง
      try {
        const res = await fetch("http://localhost:3000/addPoint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ point }),
        });
        const addData = await res.json();

        if (res.ok) {
          const pointDisplay = document.getElementById("pointValue");
          if (pointDisplay) {
            pointDisplay.textContent = "My Points : " + addData.points;
          }
          Swal.fire({
            icon: "success",
            title: "เติมสำเร็จ!",
            text: `${addData.msg} +${point} Points`,
          }).then(() => {
          window.location.href = '/';
        });
        } else {
          Swal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: addData.msg || "เติมไม่สำเร็จ",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: err.message,
        });
      }
    }
  });
}

async function generateQRCode(point) {
  const phone = "0803371641";
  const pointFloat = parseFloat(point);
  console.log(pointFloat);

  // ส่งไป backend
  const res = await fetch("http://localhost:3000/generate-promptpay-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, amount: pointFloat }),
  });
  const data = await res.json();
  document.getElementById(
    "qrContainer"
  ).innerHTML = `<img src="${data.qrDataUrl}" alt="PromptPay QR"/>`;
}

async function loadFavorites() {
  const res = await fetch("/api/favorites", { credentials: "include" });
  const data = await res.json();

  const container = document.getElementById("favoritesContainer");
  container.innerHTML = "";
  data.forEach(novel => {
    container.innerHTML += `
      <a href="/detail_novel/${novel._id}" 
         class="w-[200px] h-[260px] rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-md transition transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
        <div class="relative w-full h-full">
          <img src="${novel.image_url}" alt="Novel Cover" class="w-full h-full object-cover" />
          <div class="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm p-3">
            <h3 class="text-base font-bold truncate">${novel.title}</h3>
            <div class="flex justify-between items-center">
              <span class="text-pink-400 font-bold">${novel.price}฿</span>
            </div>
          </div>
        </div>
      </a>`;
  });
}

