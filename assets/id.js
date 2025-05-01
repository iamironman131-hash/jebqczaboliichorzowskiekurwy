const timeElement = document.getElementById('time');
const params = new URLSearchParams(window.location.search);
const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

function setClock() {
  const date = new Date();
  timeElement.innerHTML = `Czas: ${
    date.toTimeString().split(' ')[0]
  } ${date.toLocaleDateString('pl-PL', options)}`;
}

setClock();
setInterval(setClock, 1000);

let webManifest = {
  name: '',
  short_name: '',
  theme_color: '#f5f6fb',
  background_color: '#f5f6fb',
  display: 'standalone',
};

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || window.opera;

  if (/windows phone/i.test(userAgent)) return 1;
  if (/android/i.test(userAgent)) return 2;
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 3;
  return 4;
}

if (getMobileOperatingSystem() == 2) {
  document.querySelector('.bottom_bar').style.height = '70px';
}

const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = `data:application/manifest+json;base64,${btoa(
  JSON.stringify(webManifest)
)}`;
document.head.prepend(manifestLink);

const unfoldElement = document.querySelector('.info_holder');
unfoldElement.addEventListener('click', () => {
  unfoldElement.classList.toggle('unfolded');
});

const imageParam = params.get('image');
if (imageParam) {
  document.querySelector(
    '.id_own_image'
  ).style.backgroundImage = `url(${imageParam})`;
}

const birthday = params.get('birthday');
const sex = params.get('sex');
const setData = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.innerHTML = value || '';
};

setData('name', params.get('name').toUpperCase());
setData('surname', params.get('surname').toUpperCase());
setData('nationality', params.get('nationality').toUpperCase());
setData('birthday', birthday);
setData('familyName', params.get('familyName'));
setData('sex', sex);
setData('fathersFamilyName', params.get('fathersFamilyName'));
setData('mothersFamilyName', params.get('mothersFamilyName'));
setData('birthPlace', params.get('birthPlace'));
setData('countryOfBirth', params.get('countryOfBirth'));
setData(
  'adress',
  `ul. ${params.get('adress1') || ''}<br>${params.get('adress2') || ''} ${
    params.get('city') || ''
  }`
);
setData('checkInDate', params.get('checkInDate'));

function generatePesel(birthday, sex) {
  let [day, month, year] = birthday.split('.').map((v) => parseInt(v, 10));

  if (year >= 2000 && year < 2100) {
    month += 20;
  }

  const yearStr = year.toString().slice(-2);
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');

  let later;
  if (sex.toLowerCase() === "mężczyzna") {
    later = "0295"; // mężczyzna - ostatnia cyfra nieparzysta
  } else {
    later = "0382"; // kobieta - ostatnia cyfra parzysta
  }

  const partialPesel = yearStr + monthStr + dayStr + later;

  // Wagi do obliczenia cyfry kontrolnej
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += parseInt(partialPesel[i], 10) * weights[i];
  }

  const mod = sum % 10;
  const controlDigit = (10 - mod) % 10;

  const pesel = partialPesel + controlDigit.toString();

  return pesel;
}


if (birthday) {
   setData("pesel", generatePesel(birthday, sex));
}

  