const jobs = [
  { title: 'Product Designer',  company: 'Notion', location: 'Remote',        type: 'Full-time' },
  { title: 'Frontend Engineer', company: 'Linear', location: 'San Francisco', type: 'Full-time' },
  { title: 'Data Analyst',      company: 'Stripe', location: 'New York',      type: 'Hybrid'    },
  { title: 'Marketing Lead',    company: 'Figma',  location: 'Remote',        type: 'Full-time' },
  { title: 'Backend Developer', company: 'Vercel', location: 'Remote',        type: 'Contract'  },
  { title: 'UX Researcher',     company: 'Airbnb', location: 'Seattle',       type: 'Full-time' },
];

let editingIndex = -1;

const jobsList    = document.getElementById('jobs-list');
const postForm    = document.getElementById('post-job-form');
const searchInput = document.getElementById('search-input');

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const list = q ? jobs.filter(j =>
    j.title.toLowerCase().includes(q) ||
    j.company.toLowerCase().includes(q) ||
    j.location.toLowerCase().includes(q)
  ) : jobs;

  document.getElementById('job-count').textContent = `${jobs.length} open`;
  document.getElementById('no-results').style.display = list.length === 0 ? 'block' : 'none';

  jobsList.innerHTML = list.map((job, i) => `
    <div class="job-row">
      <div class="job-main">
        <span class="job-title">${job.title}</span>
        <span class="job-company">${job.company}</span>
      </div>
      <div class="job-right">
        <div class="job-meta">
          <span class="job-location">${job.location}</span>
          <span class="job-type">${job.type}</span>
        </div>
        <div class="job-actions">
          <button class="btn-update" data-index="${i}">edit</button>
          <button class="btn-delete" data-index="${i}">delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function closeForm() {
  postForm.classList.remove('visible');
  postForm.reset();
  document.getElementById('form-submit').textContent = 'post job';
  editingIndex = -1;
}

// post / save edit
document.getElementById('form-submit').addEventListener('click', () => {
  const title    = document.getElementById('form-title').value.trim();
  const company  = document.getElementById('form-company').value.trim();
  const location = document.getElementById('form-location').value.trim();
  const type     = document.getElementById('form-type').value;

  if (!title || !company || !location || !type) return;

  if (editingIndex === -1) {
    jobs.unshift({ title, company, location, type });
  } else {
    jobs[editingIndex] = { title, company, location, type };
  }

  closeForm();
  render();
});

document.getElementById('form-cancel').addEventListener('click', closeForm);

// delete / edit buttons
jobsList.addEventListener('click', e => {
  const i = parseInt(e.target.dataset.index);

  if (e.target.classList.contains('btn-delete')) {
    jobs.splice(i, 1);
    render();
  }

  if (e.target.classList.contains('btn-update')) {
    const { title, company, location, type } = jobs[i];
    document.getElementById('form-title').value    = title;
    document.getElementById('form-company').value  = company;
    document.getElementById('form-location').value = location;
    document.getElementById('form-type').value     = type;
    document.getElementById('form-submit').textContent = 'save changes';
    editingIndex = i;
    postForm.classList.add('visible');
    document.getElementById('form-title').focus();
  }
});

// open form
document.getElementById('cta-post').addEventListener('click', e => {
  e.preventDefault();
  postForm.classList.add('visible');
  postForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById('form-title').focus();
});

// search
document.getElementById('search-btn').addEventListener('click', render);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
searchInput.addEventListener('input',   () => { if (!searchInput.value) render(); });

render();
