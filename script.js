const courses = [
  {
    id: 1,
    name: 'DevOps',
    duration: '3 mois',
    price: 800,
    image: 'images/devops2.png',
    details: 'Apprenez les compétences nécessaires pour devenir un ingénieur DevOps. Vous apprendrez à automatiser les processus de développement, de test et de déploiement.'
  },
  {
    id: 2,
    name: 'Dév Web Niveau 1',
    duration: '2 mois',
    price: 600,
    image: 'images/web1.webp',
    details: 'Apprenez les bases de la programmation Web, y compris HTML, CSS et JavaScript. Vous travaillerez sur un projet pour construire un site Web simple.'
  },
  {
    id: 3,
    name: 'Dév Web Niveau 2',
    duration: '2 mois',
    price: 700,
    image: 'images/web2.jpg',
    details: 'Apprenez les compétences avancées de développement Web, y compris les frameworks front-end et back-end. Vous travaillerez sur un projet pour construire une application Web complète.'
  },
  {
    id: 4,
    name: 'Deep Learning',
    duration: '4 mois',
    price: 1000,
    image: 'images/deep_learning.webp',
    details: 'Apprenez les bases du Deep Learning, y compris les réseaux de neurones, l\'apprentissage supervisé et non supervisé. Vous travaillerez sur un projet pour construire un modèle de Deep Learning simple.'
  },
  {
    id: 5,
    name: 'Python',
    duration: '2 mois',
    price: 500,
    image: 'images/python.png',
    details: 'Apprenez les bases de la programmation Python, y compris les structures de données, les fonctions et les modules. Vous travaillerez sur un projet pour construire une application Python simple.'
  },
];

const coursesListElement = document.getElementById('courses-list');
const selectedCoursesElement = document.getElementById('selected-courses');
const addCourseButton = document.getElementById('add-course');
const autoPickDatesButton = document.getElementById('auto-pick-dates');
const studentForm = document.getElementById('student-form');
const summarySection = document.getElementById('summary');
const summaryContent = document.getElementById('summary-content');
const printSummaryButton = document.getElementById('print-summary');
const emailSummaryButton = document.getElementById('email-summary');
const generatePDFButton = document.getElementById('generate-pdf');
const toggleModeButton = document.getElementById('toggle-mode');

let selectedCourses = [];

// afficher les formations
courses.forEach((course) => {
  const courseCard = document.createElement('div');
  courseCard.classList.add('course-card');
  courseCard.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${course.image})`;
  courseCard.innerHTML = `
        <div class="course-details">
          <div>
            <h3>${course.name}</h3>
            <p>Durée: ${course.duration}</p>
          </div>
          <div class="price_see">
            <h3 class="detail_price">Prix: ${course.price} DT</h3>
            <button class="see-more" data-id="${course.id}">voir plus</button>
          </div>
        </div>
    `;
  courseCard.addEventListener('click', () => {
    if (selectedCourses.length < 3 && !selectedCourses.includes(course.id)) {
      selectedCourses.push(course.id);
      courseCard.classList.add('selected');
      addSelectedCourse(course);
    }
  });
  coursesListElement.appendChild(courseCard);
});

// ajouter une formation function
addCourseButton.addEventListener('click', () => {
  const availableCourses = courses.filter(course => !selectedCourses.includes(course.id));
  if (availableCourses.length > 0) {
    const course = availableCourses[0];
    selectedCourses.push(course.id);
    addSelectedCourse(course);
    document.querySelector(`.course-card[data-id="${course.id}"]`).classList.add('selected');
  }
});

function addSelectedCourse(course) {
  const courseSelect = document.createElement('div');
  courseSelect.classList.add('course-item');
  courseSelect.innerHTML = `
        <select>
            ${courses.map(c => `<option value="${c.id}" ${c.id === course.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
        <input type="date" required>
        <button type="button" id="see_more" class="remove-course">Supprimer</button>
    `;
  selectedCoursesElement.appendChild(courseSelect);

  if (selectedCourses.length === 3) {
    addCourseButton.style.display = 'none';
  }
}

// supprimer une formation function
selectedCoursesElement.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-course')) {
    const courseItem = e.target.parentElement;
    const courseId = parseInt(courseItem.querySelector('select').value);
    selectedCourses = selectedCourses.filter((id) => id !== courseId);
    courseItem.remove();
    document
      .querySelector(`.course-card[data-id="${courseId}"]`)
      .classList.remove('selected');
    addCourseButton.style.display = 'inline-block';
  }
});

// function listen to see_more button, and displays a popup with the course details
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('see-more')) {
    const courseId = parseInt(e.target.getAttribute('data-id'));
    const course = courses.find((c) => c.id === courseId);
    const courseDetailsPopup = document.createElement('div');
    courseDetailsPopup.classList.add('course-details-popup');
    courseDetailsPopup.innerHTML = `
        <div class="course-details-popup-content">
          <h2>${course.name}</h2>
          <p>${course.details}</p>
          <button id="close-popup">Fermer</button>
        </div>
    `;
    document.body.appendChild(courseDetailsPopup);

    document.getElementById('close-popup').addEventListener('click', () => {
      courseDetailsPopup.remove();
    });
  }
});

// Auto pick dates
autoPickDatesButton.addEventListener('click', () => {
  const today = new Date();
  let previousEndDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); 

  Array.from(selectedCoursesElement.children).forEach((courseItem, index) => {
    const courseId = courseItem.querySelector('select').value;
    const course = courses.find((c) => c.id === parseInt(courseId));
    const startDateInput = courseItem.querySelector('input[type="date"]');

    const startDate = new Date(previousEndDate.getTime());
    startDate.setDate(startDate.getDate() + 1);

    const durationInDays = parseInt(course.duration) * 30;
    previousEndDate = new Date(
      startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
    );
    previousEndDate = new Date(
      previousEndDate.getTime() + 2 * 24 * 60 * 60 * 1000 // ajouter 2 jours
    ); 

    startDateInput.value = startDate.toISOString().split('T')[0];
  });
});

// Form submission 
studentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(studentForm);
  const studentInfo = Object.fromEntries(formData.entries());

  const selectedCoursesData = Array.from(selectedCoursesElement.children).map(
    (courseItem) => {
      const courseId = courseItem.querySelector('select').value;
      const startDate = courseItem.querySelector('input[type="date"]').value;
      return { ...courses.find((c) => c.id === parseInt(courseId)), startDate };
    }
  );

  // Validate course 
  if (selectedCoursesData.length < 2) {
    alert('Veuillez sélectionner au moins 2 formations.');
    return;
  }

  // Dates validation
  const today = new Date();
  let previousEndDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);// une semaine
  console.log('previousEndDate', previousEndDate);
  for (let i = 0; i < selectedCoursesData.length; i++) {
    const course = selectedCoursesData[i];
    const startDate = new Date(course.startDate);
    if (startDate <= previousEndDate) {
      alert(
        `La date de début de la formation "${course.name}" n'est pas valide.`
      );
      return;
    }

    const durationInDays = parseInt(course.duration) * 30;
    previousEndDate = new Date(
      startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
    );
    previousEndDate = new Date(
      previousEndDate.getTime() + 2 * 24 * 60 * 60 * 1000
    );
  }

  // total price
  let totalPrice = selectedCoursesData.reduce(
    (sum, course) => sum + course.price,
    0
  );
  let discount = 0;

  if (totalPrice > 1500) {
    discount = totalPrice * 0.1;
    totalPrice -= discount;
  }

  // afficher le récapitulatif
  summaryContent.innerHTML = `
        <div class="widget">
          <h3>Informations personnelles</h3>
          <p><strong>Nom:</strong> ${studentInfo.lastName}</p>
          <p><strong>Prénom:</strong> ${studentInfo.firstName}</p>
          <p><strong>Adresse:</strong> ${studentInfo.address}</p>
          <p><strong>Téléphone:</strong> ${studentInfo.phone}</p>
          <p><strong>Email:</strong> ${studentInfo.email}</p>
          <p><strong>Niveau:</strong> ${studentInfo.level}</p>
        </div>

        <div class="widget">
          <h3>Formations sélectionnées</h3>
          ${selectedCoursesData
            .map(
              (course) => `
              <div>
                  <p><strong>${course.name}</strong></p>
                  <p>Date de début: ${course.startDate}</p>
                  <p>Durée: ${course.duration}</p>
                  <p>Prix: ${course.price} DT</p>
              </div>
          `
            )
            .join('')}
        </div>

        <div class="widget">
          <h3>Récapitulatif financier</h3>
          <p><strong>Prix total:</strong> ${totalPrice + discount} DT</p>
          <p><strong>Réduction:</strong> ${discount} DT (10%)</p>
          <p><strong>Prix final:</strong> ${totalPrice} DT</p>
        </div>
    `;

  summarySection.style.display = 'block';
});

// Print
printSummaryButton.addEventListener('click', () => {
  window.print();
});

//  PDF 
generatePDFButton.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.html(summaryContent, {
    callback: function (doc) {
      doc.save('recapitulatif-formation.pdf');
    },
    x: 15,
    y: 15,
    width: 170,
    windowWidth: 650,
  });
});

// Toggle dark and light mode
toggleModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleModeButton.textContent = document.body.classList.contains('dark-mode')
    ? 'Mode Clair'
    : 'Mode Sombre';
});

document.addEventListener('DOMContentLoaded', () => {
  const headerH1 = document.querySelector('header h1');
  headerH1.addEventListener('animationend', (event) => {
    if (event.animationName === 'typing') {
      headerH1.classList.add('typing-done');
    }
  });
  headerH1.addEventListener('animationend', () => {
    headerH1.classList.add('typing-done');
    headerH1.style.width = 'auto';
  });
});
