const insectGroups = [
	{ key: 'honeybees', label: 'Honingbijen', detailName: 'Bij' },
	{ key: 'wildBees', label: 'Wilde bijen', detailName: 'Wilde bij' },
	{ key: 'bumblebees', label: 'Hommels', detailName: 'Hommel' },
	{ key: 'butterflies', label: 'Vlinders', detailName: 'Vlinder' },
	{ key: 'hoverflies', label: 'Zweefvliegen', detailName: 'Zweefvlieg' }
];

const numberFormat = new Intl.NumberFormat('nl-NL');
const statusElement = document.querySelector('#results-status');
const contentElement = document.querySelector('#results-content');
const gardenSelectA = document.querySelector('#garden-a');
const gardenSelectB = document.querySelector('#garden-b');
const gardenComparison = document.querySelector('#garden-comparison');
const scrollRevealObserver = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window
	? new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
	: null;

document.querySelectorAll('.results-heading, .chart-help, #results-content > .results-summary, #results-content > .results-section, .results-method')
	.forEach((element) => element.classList.add('scroll-reveal'));

function observeScrollReveals(root = document) {
	const elements = root instanceof Element && root.matches('.scroll-reveal') ? [root] : [];
	elements.push(...root.querySelectorAll('.scroll-reveal:not(.is-visible)'));

	elements.forEach((element) => {
		if (element.classList.contains('is-visible')) return;
		if (scrollRevealObserver) scrollRevealObserver.observe(element);
		else element.classList.add('is-visible');
	});
}

observeScrollReveals(document.querySelector('.results-heading'));

function sumGroups(observation) {
	return insectGroups.reduce((total, group) => total + observation[group.key], 0);
}

function validateObservations(observations) {
	if (!Array.isArray(observations) || observations.length === 0) {
		throw new Error('Er zijn geen waarnemingen beschikbaar.');
	}

	observations.forEach((observation, index) => {
		const hasCounts = insectGroups.every(({ key }) => Number.isInteger(observation[key]) && observation[key] >= 0);
		if (!observation.plant || !observation.garden || !hasCounts || observation.totalInsects !== sumGroups(observation)) {
			throw new Error(`De waarneming ${index + 1} bevat ongeldige gegevens.`);
		}
	});
}

function aggregateObservations(observations) {
	const plants = new Map();
	const gardens = new Map();
	const insectTotals = Object.fromEntries(insectGroups.map(({ key }) => [key, 0]));
	let totalInsects = 0;

	observations.forEach((observation) => {
		const plant = plants.get(observation.plant) ?? { name: observation.plant, total: 0 };
		plant.total += observation.totalInsects;
		plants.set(plant.name, plant);

		const garden = gardens.get(observation.garden) ?? {
			name: observation.garden,
			total: 0,
			insects: Object.fromEntries(insectGroups.map(({ key }) => [key, 0])),
			plants: new Map()
		};
		garden.total += observation.totalInsects;
		garden.plants.set(observation.plant, (garden.plants.get(observation.plant) ?? 0) + observation.totalInsects);

		insectGroups.forEach(({ key }) => {
			insectTotals[key] += observation[key];
			garden.insects[key] += observation[key];
		});

		gardens.set(garden.name, garden);
		totalInsects += observation.totalInsects;
	});

	return { plants, gardens, insectTotals, totalInsects };
}

function sortByTotal(entries) {
	return [...entries].sort((first, second) => second.total - first.total || first.name.localeCompare(second.name, 'nl'));
}

function createDetailLink(name, type, groupKey = '') {
	const link = document.createElement('a');
	link.className = 'detail-link';
	link.textContent = name;
	if (type === 'plant') {
		link.href = `../plants/plant.html?plant=${encodeURIComponent(name)}`;
	} else {
		const group = insectGroups.find(({ key }) => key === groupKey);
		link.href = `../insects/insect.html?insect=${encodeURIComponent(group?.detailName ?? name)}`;
	}
	return link;
}

function appendBarRows(list, entries, maximum, detailType = '') {
	list.replaceChildren();

	entries.forEach((entry, index) => {
		const row = document.createElement('li');
		row.className = `bar-row scroll-reveal${entry.key ? ` insect-${entry.key}` : ''}`;
		row.style.setProperty('--row-index', index);

		const label = detailType
			? createDetailLink(entry.name, detailType, entry.key)
			: document.createElement('span');
		label.className = 'bar-label';
		if (!detailType) label.textContent = entry.name;

		const track = document.createElement('span');
		track.className = 'bar-track';
		track.setAttribute('aria-hidden', 'true');

		const fill = document.createElement('span');
		fill.className = 'bar-fill';
		fill.style.setProperty('--bar-width', `${maximum ? (entry.total / maximum) * 100 : 0}%`);
		track.append(fill);

		const value = document.createElement('strong');
		value.className = 'bar-value';
		value.textContent = numberFormat.format(entry.total);

		row.append(label, track, value);
		list.append(row);
	});

	observeScrollReveals(list);
}

function renderGardenComparison(summary) {
	const selectedNames = [gardenSelectA.value, gardenSelectB.value];
	const selectedGardens = selectedNames.map((name) => summary.gardens.get(name));
	const maximumInsectCount = Math.max(1, ...selectedGardens.flatMap((garden) => insectGroups.map(({ key }) => garden.insects[key])));
	const maximumPlantCount = Math.max(1, ...selectedGardens.flatMap((garden) => [...garden.plants.values()]));
	gardenComparison.replaceChildren();

	selectedGardens.forEach((garden, index) => {
		const panel = document.createElement('article');
		panel.className = 'garden-result scroll-reveal';
		panel.style.setProperty('--garden-color', index === 0 ? 'var(--results-garden-a)' : 'var(--results-garden-b)');

		const heading = document.createElement('h3');
		heading.textContent = garden.name;

		const total = document.createElement('p');
		total.className = 'garden-total';
		total.textContent = `${numberFormat.format(garden.total)} insecten in ${numberFormat.format(garden.plants.size)} planten`;

		const insectHeading = document.createElement('h4');
		insectHeading.textContent = 'Insectengroepen';
		const insectList = document.createElement('ol');
		insectList.className = 'bar-list';
		insectList.setAttribute('aria-label', `Insectengroepen in ${garden.name}`);
		appendBarRows(insectList, insectGroups.map(({ key, label }) => ({ name: label, total: garden.insects[key], key })), maximumInsectCount, 'insect');

		const plantHeading = document.createElement('h4');
		plantHeading.textContent = 'Meest getelde planten';
		const plantList = document.createElement('ol');
		plantList.className = 'bar-list';
		plantList.setAttribute('aria-label', `Meest getelde planten in ${garden.name}`);
		const topPlants = sortByTotal([...garden.plants].map(([name, plantTotal]) => ({ name, total: plantTotal }))).slice(0, 5);
		appendBarRows(plantList, topPlants, maximumPlantCount, 'plant');

		panel.append(heading, total, insectHeading, insectList, plantHeading, plantList);
		gardenComparison.append(panel);
	});

	observeScrollReveals(gardenComparison);
}

function populateGardenSelects(summary) {
	const gardenNames = [...summary.gardens.keys()].sort((first, second) => first.localeCompare(second, 'nl'));
	[gardenSelectA, gardenSelectB].forEach((select) => {
		select.replaceChildren(...gardenNames.map((name) => {
			const option = document.createElement('option');
			option.value = name;
			option.textContent = name;
			return option;
		}));
	});

	gardenSelectA.value = gardenNames.includes('Witte tuin') ? 'Witte tuin' : gardenNames[0];
	gardenSelectB.value = gardenNames.includes('Blauw-gele tuin') ? 'Blauw-gele tuin' : gardenNames.find((name) => name !== gardenSelectA.value) ?? gardenNames[0];
}

function updateGardenComparison(changedSelect, otherSelect, summary) {
	if (changedSelect.value === otherSelect.value) {
		otherSelect.value = [...summary.gardens.keys()].find((name) => name !== changedSelect.value) ?? otherSelect.value;
	}

	renderGardenComparison(summary);
}

function renderResults(observations) {
	const summary = aggregateObservations(observations);
	const plants = sortByTotal([...summary.plants.values()]);
	const insects = sortByTotal(insectGroups.map(({ key, label }) => ({ name: label, total: summary.insectTotals[key], key })));
	const leadingPlant = plants[0];
	const leadingInsect = insects[0];

	document.querySelector('#summary-observations').textContent = numberFormat.format(observations.length);
	document.querySelector('#summary-insects').textContent = numberFormat.format(summary.totalInsects);
	const summaryPlant = document.querySelector('#summary-plant');
	summaryPlant.replaceChildren(createDetailLink(leadingPlant.name, 'plant'), document.createTextNode(` · ${numberFormat.format(leadingPlant.total)}`));
	const summaryInsect = document.querySelector('#summary-insect');
	summaryInsect.replaceChildren(createDetailLink(leadingInsect.name, 'insect', leadingInsect.key), document.createTextNode(` · ${numberFormat.format(leadingInsect.total)}`));
	appendBarRows(document.querySelector('#plant-ranking'), plants, Math.max(1, leadingPlant.total), 'plant');
	appendBarRows(document.querySelector('#insect-ranking'), insects, Math.max(1, leadingInsect.total), 'insect');

	populateGardenSelects(summary);
	gardenSelectA.addEventListener('change', () => updateGardenComparison(gardenSelectA, gardenSelectB, summary));
	gardenSelectB.addEventListener('change', () => updateGardenComparison(gardenSelectB, gardenSelectA, summary));
	renderGardenComparison(summary);
}

async function loadResults() {
	try {
		const response = await fetch('./data.json');
		if (!response.ok) throw new Error('De waarnemingen konden niet worden geladen.');
		const data = await response.json();
		validateObservations(data.observations);
		renderResults(data.observations);
		statusElement.textContent = `${numberFormat.format(data.observations.length)} plantwaarnemingen geladen.`;
		contentElement.hidden = false;
		observeScrollReveals(contentElement);
	} catch (error) {
		statusElement.classList.add('is-error');
		statusElement.textContent = error instanceof TypeError
			? 'De waarnemingen konden niet worden geladen. Controleer de verbinding en probeer het later opnieuw.'
			: error instanceof Error ? error.message : 'De resultaten konden niet worden geladen.';
	}
}

loadResults();
