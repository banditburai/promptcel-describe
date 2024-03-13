document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.querySelector(".ground-truth-gallery");
  const imageComparisonsContainer = document.querySelector(
    ".image-comparisons",
  );
  const modalContainer = document.getElementById("modal-container");
  const modalContent = document.getElementById("modal-content");
  const infoButton = document.querySelector(".info-button");
  const backToTopButton = document.querySelector(".back-to-top");

  function createGalleryItem(image) {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    const anchor = document.createElement("a");
    const groundTruthUrl = image.url.split("_index")[0].split(".com/")[1];
    anchor.href = `#image-${encodeURIComponent(groundTruthUrl)}`;

    const img = document.createElement("img");
    // img.setAttribute("data-src", image.url);
    img.src = image.url;
    img.alt = image.alt;
    // img.classList.add("lazy-load");

    anchor.appendChild(img);
    galleryItem.appendChild(anchor);
    return galleryItem;
  }

  function createImageComparison(groundTruthImage, jobs) {
    const comparisonSection = document.createElement("section");
    const groundTruthUrl =
      groundTruthImage.url.split("_index")[0].split(".com/")[1];
    comparisonSection.id = `image-${encodeURIComponent(groundTruthUrl)}`;
    comparisonSection.classList.add("comparison-section");
  
    const groundTruthContainer = document.createElement("div");
    groundTruthContainer.classList.add("ground-truth-container");
  
    const groundTruthImageElement = document.createElement("img");
    groundTruthImageElement.src = groundTruthImage.url;
    groundTruthImageElement.alt = groundTruthImage.alt;
    groundTruthImageElement.classList.add("ground-truth-image");
  
    const groundTruthAlt = document.createElement("div");
    groundTruthAlt.textContent = groundTruthImage.alt;
    groundTruthAlt.classList.add("ground-truth-alt");
    groundTruthContainer.appendChild(groundTruthImageElement);
    groundTruthContainer.appendChild(groundTruthAlt);
  
    const describeImagesContainer = document.createElement("div");
    describeImagesContainer.classList.add("describe-images-container");
  
    const describeImages = document.createElement("div");
    describeImages.classList.add("describe-images");
  
    const tagOrder = [
      "use_prompt",
      "describe",
      "chatgpt",
      "moondream2",
      "llava13b",
    ];
    const sortedJobs = tagOrder.map((tag) =>
      jobs.filter((job) => job.tag === tag)
    ).flat();
  
    sortedJobs.forEach((job) => {
      const jobContainer = document.createElement("div");
      jobContainer.classList.add("job-container", `tag-${job.tag}`);
  
      const jobTitle = document.createElement("span");
      jobTitle.textContent = job.tag;
      jobTitle.classList.add("job-title");
      jobContainer.appendChild(jobTitle);
  
      const imageRow = document.createElement("div");
      imageRow.classList.add("image-row");
  
      job.images.forEach((image) => {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
  
        const describeImageElement = document.createElement("img");
        describeImageElement.src = image.url;
        describeImageElement.alt = image.alt;
        describeImageElement.classList.add("describe-image");
  
        imageContainer.appendChild(describeImageElement);
        imageRow.appendChild(imageContainer);
      });
  
      const promptTooltip = document.createElement("div");
      const promptText = document.createElement("span");
      promptText.textContent = job.images[0].alt;
      promptTooltip.appendChild(promptText);
      promptTooltip.classList.add("prompt-tooltip");
  
      imageRow.appendChild(promptTooltip);
      jobContainer.appendChild(imageRow);
      jobContainer.appendChild(jobTitle);
      describeImages.appendChild(jobContainer);
    });
  
    describeImagesContainer.appendChild(describeImages);
    comparisonSection.appendChild(groundTruthContainer);
    comparisonSection.appendChild(describeImagesContainer);
  
    return comparisonSection;
  }

  function renderGallery(imageData) {
    galleryContainer.innerHTML = "";  
    const seed = Math.random();  
    const shuffledImageData = shuffleArray(imageData, seed);
  
    shuffledImageData.forEach((image, index) => {
      image.id = index + 1;
      const galleryItem = createGalleryItem(image);
      galleryContainer.appendChild(galleryItem);
    });
  }
  
  function shuffleArray(array, seed) {
    const shuffledArray = [...array];
    shuffledArray.sort(() => seed - 0.5);
    return shuffledArray;
  }

  function createTableContent(groundTruthImage, jobs) {
    modalContent.innerHTML = "";
    modalContent.scrollTop = 0;

    const table = document.createElement("table");
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const thumbnailHeader = document.createElement("th");
    thumbnailHeader.textContent = "Thumbnail";
    const promptHeader = document.createElement("th");
    promptHeader.textContent = "Prompt";
    const closeButtonHeader = document.createElement("th");
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", handleCloseButtonClick);
    closeButtonHeader.appendChild(closeButton);

    headerRow.appendChild(thumbnailHeader);
    headerRow.appendChild(promptHeader);
    headerRow.appendChild(closeButtonHeader);
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    jobs.forEach((job) => {
      job.images.forEach((image) => {
        const row = document.createElement("tr");
        const thumbnailCell = document.createElement("td");
        const thumbnail = document.createElement("img");
        thumbnail.src = image.url;
        thumbnail.alt = image.alt;
        thumbnail.classList.add("thumbnail");
        thumbnailCell.appendChild(thumbnail);
        const promptCell = document.createElement("td");
        promptCell.textContent = image.alt;
        row.appendChild(thumbnailCell);
        row.appendChild(promptCell);
        tableBody.appendChild(row);
      });
    });

    table.appendChild(tableBody);
    modalContent.appendChild(table);
  }

const modalContentHandlers = {};

modalContentHandlers["image"] = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const groundTruthImage = {
      url: section.querySelector(".ground-truth-image").src,
      alt: section.querySelector(".ground-truth-alt").textContent,
    };
    const jobs = Array.from(section.querySelectorAll(".job-container")).map(
      (jobContainer) => ({
        tag: jobContainer.querySelector(".job-title").textContent,
        images: Array.from(jobContainer.querySelectorAll(".describe-image"))
          .map((img) => ({
            url: img.src,
            alt: img.alt,
          })),
      })
    );

    createTableContent(groundTruthImage, jobs);
  }
};

modalContentHandlers["ground-truth-gallery"] = () => {
  const heading = document.createElement("h2");
  heading.textContent = "Welcome to the Comparison Gallery";
  
  const description1 = document.createElement("p");
  description1.textContent = "Explore the detailed comparisons between the original images and the generated descriptions.";
  
  const description2 = document.createElement("p");
  description2.textContent = "Click on an image in the gallery to view the comparisons from Midjourney's describe, ChatGPT, Moondream2 or LLava 13b.";
  
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", handleCloseButtonClick);
  
  modalContent.appendChild(heading);
  modalContent.appendChild(description1);
  modalContent.appendChild(description2);
  modalContent.appendChild(closeButton);
};

const defaultContentHandler = () => {
  const heading = document.createElement("h2");
  heading.textContent = "No Information Available";
  
  const message = document.createElement("p");
  message.textContent = "Sorry, there is no additional information available for this section at the moment.";
  
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", handleCloseButtonClick);
  
  modalContent.appendChild(heading);
  modalContent.appendChild(message);
  modalContent.appendChild(closeButton);
};

function setModalContent(sectionId) {
  console.log("Updating modal content for section:", sectionId); // Debug log
  modalContent.innerHTML = ""; 

  // Determine the correct handler type based on the sectionId
  let handlerType;
  if (sectionId.startsWith("image-")) {
    handlerType = "image";
  } else if (sectionId === "ground-truth-gallery") {
    handlerType = "ground-truth-gallery";
  } else {
    handlerType = null; // This can help identify any unexpected sectionId values
  }

  // Log the determined handlerType for debugging
  console.log("Handler type:", handlerType);

  const contentHandler = modalContentHandlers[handlerType] || defaultContentHandler;  
  contentHandler(sectionId);
}


  function handleInfoButtonClick() {
    infoButton.innerHTML = '<div class="spinner"></div>'; 
    const sectionId = infoButton.getAttribute("data-section");
    setModalContent(sectionId);
    modalContainer.style.display = "block";
    modalContent.classList.add("open");
    modalContent.scrollTop = 0;
    infoButton.style.display = "none";
    backToTopButton.style.display = "none";
    document.body.style.overflow = "hidden";
  }

  function handleCloseButtonClick() {
    infoButton.style.display = "flex";
    backToTopButton.style.display = "flex";
    modalContainer.style.display = "none";
    modalContent.classList.remove("open");    
    infoButton.innerHTML = "i";
    document.body.style.overflow = "auto";
  }


  let previousScrollPosition = window.scrollY;
  let scrollDirection = "down";

infoButton.setAttribute("data-section", "ground-truth-gallery");

function handleIntersection(entries, observer) {
  let maxRatio = 0;
  let mostVisibleSectionId = "ground-truth-gallery";


  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition > previousScrollPosition) {
    scrollDirection = "down";
  } else {
    scrollDirection = "up";
  }
  previousScrollPosition = currentScrollPosition;

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const sectionTop = entry.boundingClientRect.top;
      const sectionBottom = entry.boundingClientRect.bottom;
      const sectionHeight = entry.boundingClientRect.height;
      const viewportHeight = window.innerHeight;

      let sectionRatio;
      if (scrollDirection === "down") {
        // Favor sections entering the view from the bottom when scrolling down
        sectionRatio = (viewportHeight - sectionTop) / sectionHeight;
      } else {
        // Favor sections remaining in view when scrolling up
        sectionRatio = sectionBottom / viewportHeight;
      }

      if (sectionRatio > maxRatio) {
        maxRatio = sectionRatio;
        mostVisibleSectionId = entry.target.id;               
      }
    }
  });

  infoButton.setAttribute("data-section", mostVisibleSectionId);
  infoButton.style.display = "flex";

   // Add the 'active' class to the most visible section and remove it from others
   document.querySelectorAll(".image-comparisons, .comparison-section").forEach((section) => {
    if (section.id === mostVisibleSectionId) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}
  

window.addEventListener('resize', function() {
  var activeSection = document.querySelector('.image-comparisons.active, .comparison-section.active');

  if (activeSection) {
    window.scrollTo({
      top: activeSection.offsetTop,
      behavior: 'instant'
    });
  }
});

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions,
  );

  function observeSections() {
    const sections = document.querySelectorAll(".comparison-section, .ground-truth-gallery");
    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  function renderImageComparisons(imageData, galleryData) {
    imageComparisonsContainer.innerHTML = "";

    imageData.forEach((item, index) => {
      const groundTruthImage = {
        id: index + 1,
        url: item.ground_truth_url,
        alt: galleryData.find((image) =>
          image.url === item.ground_truth_url
        ).alt,
      };

      const comparisonSection = createImageComparison(
        groundTruthImage,
        item.jobs,
      );
      imageComparisonsContainer.appendChild(comparisonSection);
    });
  }

  infoButton.addEventListener("click", handleInfoButtonClick);
  modalContainer.addEventListener("click", function (event) {
    if (event.target === modalContainer) {
      handleCloseButtonClick();
    }
  });


  Promise.all([
    fetch("updated_gallery.json").then((response) => response.json()),
    fetch("optim_describe.json").then((response) => response.json()),
  ])
    .then(([galleryData, groundTruthData]) => {
      renderGallery(galleryData);
      renderImageComparisons(groundTruthData, galleryData);
      observeSections();            
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });
});
