const addMedicineButton = document.getElementById('addMedicineButton');
const medicineInputsContainer = document.getElementById('medicineInputs');
const medicineInputTemplate = document.getElementById('medicineInputTemplate');

// Function to fetch and populate medicine dropdown
async function fetchAndPopulateDropdown(selectElement) {
  const response = await fetch('/all-medicines');
  const medicines = await response.json();

  medicines.forEach(medicine => {
    const option = document.createElement('option');
    option.value = medicine._id;
    option.textContent = `${medicine.name} - Rs.${medicine.price}`;
    selectElement.appendChild(option);
  });
}

// Function to add medicine input fields
function addMedicineInput() {
  const clone = document.importNode(medicineInputTemplate.content, true);
  const medicineNameSelect = clone.querySelector('.medicineNameSelect');
  fetchAndPopulateDropdown(medicineNameSelect);
  medicineInputsContainer.appendChild(clone);
}

// Event listener for "Add Medicine" button
addMedicineButton.addEventListener('click', addMedicineInput);

// Initial call to add the first medicine input field
addMedicineInput();
