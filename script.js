document.addEventListener('DOMContentLoaded', () => {
    let allJobs = [];
    let displayedJobs = 0;
    const jobsPerPage = 6;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allJobs = data;
            displayJobs(data.slice(0, jobsPerPage));
            displayedJobs = jobsPerPage;
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('search-button').addEventListener('click', () => {
        const titleFilter = document.getElementById('search-title').value.toLowerCase();
        const locationFilter = document.getElementById('search-location').value.toLowerCase();
        const fullTimeOnly = document.getElementById('full-time-only').checked;

        const filteredJobs = allJobs.filter(job => {
            return (
                (titleFilter === '' || job.position.toLowerCase().includes(titleFilter) || job.company.toLowerCase().includes(titleFilter)) &&
                (locationFilter === '' || job.location.toLowerCase().includes(locationFilter)) &&
                (!fullTimeOnly || job.contract.toLowerCase() === 'full time')
            );
        });

        document.getElementById('jobs-container').innerHTML = '';
        displayJobs(filteredJobs.slice(0, jobsPerPage));
        displayedJobs = jobsPerPage;
    });

    document.getElementById('load-more-button').addEventListener('click', () => {
        const titleFilter = document.getElementById('search-title').value.toLowerCase();
        const locationFilter = document.getElementById('search-location').value.toLowerCase();
        const fullTimeOnly = document.getElementById('full-time-only').checked;

        const filteredJobs = allJobs.filter(job => {
            return (
                (titleFilter === '' || job.position.toLowerCase().includes(titleFilter) || job.company.toLowerCase().includes(titleFilter)) &&
                (locationFilter === '' || job.location.toLowerCase().includes(locationFilter)) &&
                (!fullTimeOnly || job.contract.toLowerCase() === 'full time')
            );
        });

        displayJobs(filteredJobs.slice(displayedJobs, displayedJobs + jobsPerPage));
        displayedJobs += jobsPerPage;
    });
});

function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-container');

    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job';
        jobElement.addEventListener('click', () => showJobDetails(job));

        jobElement.innerHTML = `
            <img src="${job.logo}" alt="${job.company} logo" style="background:${job.logoBackground};">
            <h2>${job.position}</h2>
            <p><strong>${job.company}</strong></p>
            <p>${job.location}</p>
            <p>${job.postedAt} • ${job.contract}</p>
        `;

        jobsContainer.appendChild(jobElement);
    });
}


function showJobDetails(job) {
    const jobsContainer = document.getElementById('jobs-container');
    const jobDetailsContainer = document.getElementById('job-details-container');
    jobsContainer.classList.add('hidden');
    jobDetailsContainer.classList.remove('hidden');

    const requirements = job.requirements.items.map(item => `<li>${item}</li>`).join('');
    const roleItems = job.role.items.map(item => `<li>${item}</li>`).join('');

    jobDetailsContainer.innerHTML = `
        <button onclick="hideJobDetails()">Back</button>
        <img src="${job.logo}" alt="${job.company} logo" style="background:${job.logoBackground};">
        <h2>${job.position}</h2>
        <p><strong>${job.company}</strong></p>
        <p>${job.location}</p>
        <p>${job.postedAt} • ${job.contract}</p>
        <p>${job.description}</p>
        <h3>Requirements</h3>
        <p>${job.requirements.content}</p>
        <ul>${requirements}</ul>
        <h3>Role</h3>
        <p>${job.role.content}</p>
        <ul>${roleItems}</ul>
        <a href="${job.apply}" class="apply-button">Apply Here</a>
    `;
}

function hideJobDetails() {
    const jobsContainer = document.getElementById('jobs-container');
    const jobDetailsContainer = document.getElementById('job-details-container');
    jobsContainer.classList.remove('hidden');
    jobDetailsContainer.classList.add('hidden');
}
