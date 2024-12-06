document.addEventListener("DOMContentLoaded", () => {
    const adsContainer = document.getElementById("adsContainer");
    const addAdBtn = document.getElementById("addAdBtn");
    const modal = document.getElementById("modal");
    const adForm = document.getElementById("adForm");
    const closeModal = document.getElementById("closeModal");
    const carImageInput = document.getElementById("carImage");
    let isEditing = false;
    let editingIndex = null;
  
    // Load ads from LocalStorage
    const loadAds = () => {
      const ads = JSON.parse(localStorage.getItem("ads")) || [];
      adsContainer.innerHTML = ""; // Clear container
      ads.forEach((ad, index) => createAdCard(ad, index));
    };
  
    // Show modal
    addAdBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  
    // Close modal
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
      adForm.reset();
      isEditing = false;
      editingIndex = null;
    });
  
    // Convert image to Base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };
  
    // Create ad card
    const createAdCard = (ad, index) => {
      const adCard = document.createElement("div");
      adCard.classList.add("ad-card");
      adCard.innerHTML = `
        <img src="${ad.image}" alt="${ad.name}">
        <h3>${ad.name}</h3>
        <p><strong>Narxi:</strong> $${ad.price}</p>
        <p><strong>Yili:</strong> ${ad.year}</p>
        <p><strong>Tavsif:</strong> ${ad.description}</p>
        <div class="ad-buttons">
          <button class="edit" data-index="${index}">Tahrirlash</button>
          <button class="delete" data-index="${index}">O'chirish</button>
        </div>
      `;
      adsContainer.appendChild(adCard);
  
      // Add event listeners for buttons
      adCard.querySelector(".edit").addEventListener("click", () => editAd(index));
      adCard.querySelector(".delete").addEventListener("click", () => deleteAd(index));
    };
  
    // Add or update ad
    adForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const carName = document.getElementById("carName").value;
      const carPrice = document.getElementById("carPrice").value;
      const carYear = document.getElementById("carYear").value;
      const carDesc = document.getElementById("carDesc").value;
  
      let carImageBase64 = "";
  
      if (carImageInput.files.length > 0) {
        carImageBase64 = await convertToBase64(carImageInput.files[0]);
      }
  
      const newAd = {
        name: carName,
        price: carPrice,
        year: carYear,
        description: carDesc,
        image: carImageBase64,
      };
  
      const ads = JSON.parse(localStorage.getItem("ads")) || [];
  
      if (isEditing) {
        ads[editingIndex] = newAd;
        isEditing = false;
        editingIndex = null;
      } else {
        ads.push(newAd);
      }
  
      localStorage.setItem("ads", JSON.stringify(ads));
      loadAds();
      modal.classList.add("hidden");
      adForm.reset();
    });
  
    // Edit ad
    const editAd = (index) => {
      const ads = JSON.parse(localStorage.getItem("ads")) || [];
      const ad = ads[index];
  
      document.getElementById("carName").value = ad.name;
      document.getElementById("carPrice").value = ad.price;
      document.getElementById("carYear").value = ad.year;
      document.getElementById("carDesc").value = ad.description;
      isEditing = true;
      editingIndex = index;
  
      modal.classList.remove("hidden");
    };
  
    // Delete ad
    const deleteAd = (index) => {
      const ads = JSON.parse(localStorage.getItem("ads")) || [];
      ads.splice(index, 1);
      localStorage.setItem("ads", JSON.stringify(ads));
      loadAds();
    };
  
    // Load ads on page load
    loadAds();
  });
  