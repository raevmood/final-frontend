document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.getElementById('welcome-section');
    const appSection = document.getElementById('app-section');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const displayUsername = document.getElementById('display-username');
    const loginErrorMessage = document.getElementById('login-error');

    const tabButtons = document.querySelectorAll('.tab-button');
    const deviceForms = document.querySelectorAll('.device-form');

    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessageDisplay = document.getElementById('error-message');
    const resultsDisplay = document.getElementById('results-display');

    // --- Placeholder Login Logic ---
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            displayUsername.textContent = username;
            welcomeSection.classList.add('hidden');
            appSection.classList.remove('hidden');
            loginErrorMessage.classList.add('hidden');
            // Automatically select the first tab
            tabButtons[0].click();
        } else {
            loginErrorMessage.textContent = "Please enter your name to proceed.";
            loginErrorMessage.classList.remove('hidden');
        }
    });

    // --- Tab Switching Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and hide all forms
            tabButtons.forEach(btn => btn.classList.remove('active'));
            deviceForms.forEach(form => form.classList.add('hidden'));

            // Add active class to the clicked button
            button.classList.add('active');

            // Show the corresponding device form
            const tabId = button.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');

            // Clear previous results and errors when switching tabs
            resultsDisplay.textContent = '';
            errorMessageDisplay.classList.add('hidden');
            loadingIndicator.classList.add('hidden');
        });
    });

    // --- Form Submission Logic ---
    deviceForms.forEach(formDiv => {
        const form = formDiv.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                // Clear previous messages
                resultsDisplay.textContent = '';
                errorMessageDisplay.classList.add('hidden');
                loadingIndicator.classList.remove('hidden'); // Show loading

                const formData = new FormData(form);
                const requestBody = {};
                let endpoint = '';

                // Determine endpoint and construct requestBody based on form ID
                switch (form.id) {
                    case 'phone-form':
                        endpoint = '/find_phone';
                        requestBody.user_base_prompt = document.getElementById('phone_user_base_prompt').value;
                        requestBody.location = document.getElementById('phone_location').value;
                        // Common optional fields
                        addOptionalField(requestBody, 'phone_budget', 'number');
                        addOptionalField(requestBody, 'phone_brand');
                        addOptionalField(requestBody, 'phone_os_preference');
                        addOptionalField(requestBody, 'phone_colour');
                        // Specific fields
                        addOptionalField(requestBody, 'phone_ram');
                        addOptionalField(requestBody, 'phone_storage');
                        addOptionalField(requestBody, 'phone_processor');
                        addOptionalField(requestBody, 'phone_battery');
                        addOptionalField(requestBody, 'phone_display');
                        addOptionalField(requestBody, 'phone_camera_priority');
                        addOptionalListField(requestBody, 'phone_preferred_brands');
                        break;
                    case 'laptop-form':
                        endpoint = '/find_laptop';
                        requestBody.user_base_prompt = document.getElementById('laptop_user_base_prompt').value;
                        requestBody.location = document.getElementById('laptop_location').value;
                        addOptionalField(requestBody, 'laptop_budget', 'number');
                        addOptionalField(requestBody, 'laptop_brand');
                        addOptionalField(requestBody, 'laptop_os_preference');
                        addOptionalField(requestBody, 'laptop_colour');
                        addOptionalField(requestBody, 'laptop_ram');
                        addOptionalField(requestBody, 'laptop_storage');
                        addOptionalField(requestBody, 'laptop_processor');
                        addOptionalField(requestBody, 'laptop_gpu');
                        addOptionalField(requestBody, 'laptop_display');
                        addOptionalField(requestBody, 'laptop_battery');
                        addOptionalField(requestBody, 'laptop_weight');
                        addOptionalField(requestBody, 'laptop_build');
                        addOptionalField(requestBody, 'laptop_usage');
                        addOptionalListField(requestBody, 'laptop_preferred_brands');
                        break;
                    case 'tablet-form':
                        endpoint = '/find_tablet';
                        requestBody.user_base_prompt = document.getElementById('tablet_user_base_prompt').value;
                        requestBody.location = document.getElementById('tablet_location').value;
                        addOptionalField(requestBody, 'tablet_budget', 'number');
                        addOptionalField(requestBody, 'tablet_brand');
                        addOptionalField(requestBody, 'tablet_os_preference');
                        addOptionalField(requestBody, 'tablet_colour');
                        addOptionalField(requestBody, 'tablet_ram');
                        addOptionalField(requestBody, 'tablet_storage');
                        addOptionalField(requestBody, 'tablet_processor');
                        addOptionalField(requestBody, 'tablet_display');
                        addOptionalField(requestBody, 'tablet_battery');
                        addOptionalField(requestBody, 'tablet_stylus_support', 'checkbox');
                        addOptionalField(requestBody, 'tablet_connectivity');
                        addOptionalField(requestBody, 'tablet_usage');
                        addOptionalField(requestBody, 'tablet_camera_priority');
                        addOptionalListField(requestBody, 'tablet_preferred_brands');
                        break;
                    case 'earpiece-form':
                        endpoint = '/find_earpiece';
                        requestBody.user_base_prompt = document.getElementById('earpiece_user_base_prompt').value;
                        requestBody.location = document.getElementById('earpiece_location').value;
                        addOptionalField(requestBody, 'earpiece_budget', 'number');
                        addOptionalField(requestBody, 'earpiece_brand');
                        addOptionalField(requestBody, 'earpiece_os_preference');
                        addOptionalField(requestBody, 'earpiece_colour');
                        addOptionalField(requestBody, 'earpiece_type');
                        addOptionalField(requestBody, 'earpiece_connectivity');
                        addOptionalField(requestBody, 'earpiece_battery_life');
                        addOptionalField(requestBody, 'earpiece_noise_cancellation');
                        addOptionalField(requestBody, 'earpiece_mic_quality');
                        addOptionalField(requestBody, 'earpiece_sound_profile');
                        addOptionalListField(requestBody, 'earpiece_preferred_brands');
                        break;
                    case 'prebuilt_pc-form':
                        endpoint = '/find_prebuilt_pc';
                        requestBody.user_base_prompt = document.getElementById('prebuilt_pc_user_base_prompt').value;
                        requestBody.location = document.getElementById('prebuilt_pc_location').value;
                        addOptionalField(requestBody, 'prebuilt_pc_budget', 'number');
                        addOptionalField(requestBody, 'prebuilt_pc_brand');
                        addOptionalField(requestBody, 'prebuilt_pc_os_preference');
                        addOptionalField(requestBody, 'prebuilt_pc_colour');
                        addOptionalField(requestBody, 'prebuilt_pc_usage');
                        addOptionalField(requestBody, 'prebuilt_pc_cpu_preference');
                        addOptionalField(requestBody, 'prebuilt_pc_gpu_requirement');
                        addOptionalField(requestBody, 'prebuilt_pc_ram_capacity');
                        addOptionalField(requestBody, 'prebuilt_pc_storage_size');
                        addOptionalField(requestBody, 'prebuilt_pc_monitor_included', 'checkbox');
                        addOptionalListField(requestBody, 'prebuilt_pc_preferred_brands');
                        break;
                    case 'pc_builder-form':
                        endpoint = '/build_custom_pc';
                        requestBody.user_base_prompt = document.getElementById('pc_builder_user_base_prompt').value;
                        requestBody.location = document.getElementById('pc_builder_location').value;
                        addOptionalField(requestBody, 'pc_builder_budget', 'number');
                        addOptionalField(requestBody, 'pc_builder_brand');
                        addOptionalField(requestBody, 'pc_builder_os_preference');
                        addOptionalField(requestBody, 'pc_builder_colour');
                        addOptionalField(requestBody, 'pc_builder_use_case');
                        addOptionalField(requestBody, 'pc_builder_cpu_preference');
                        addOptionalField(requestBody, 'pc_builder_gpu_preference');
                        addOptionalField(requestBody, 'pc_builder_ram_capacity');
                        addOptionalField(requestBody, 'pc_builder_ram_type');
                        addOptionalField(requestBody, 'pc_builder_storage_preference');
                        addOptionalField(requestBody, 'pc_builder_ssd_size_preference');
                        addOptionalField(requestBody, 'pc_builder_power_supply_preference');
                        addOptionalField(requestBody, 'pc_builder_form_factor');
                        addOptionalField(requestBody, 'pc_builder_cooling_type');
                        addOptionalField(requestBody, 'pc_builder_monitor_refresh_rate');
                        addOptionalField(requestBody, 'pc_builder_monitor_quality');
                        addOptionalField(requestBody, 'pc_builder_aesthetic_preference');
                        addOptionalField(requestBody, 'pc_builder_peripherals_included', 'checkbox');
                        addOptionalListField(requestBody, 'pc_builder_preferred_brands');
                        break;
                    default:
                        console.error("Unknown form ID:", form.id);
                        displayError("An internal error occurred. Please try again.");
                        loadingIndicator.classList.add('hidden');
                        return;
                }

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('API Error:', errorData);
                        displayError(errorData.detail || `Error: ${response.status} ${response.statusText}`);
                        return;
                    }

                    const data = await response.json();
                    resultsDisplay.textContent = JSON.stringify(data, null, 2); // Pretty print JSON
                } catch (error) {
                    console.error('Fetch Error:', error);
                    displayError('Network error or server is unreachable. Please check your connection or try again later.');
                } finally {
                    loadingIndicator.classList.add('hidden'); // Hide loading regardless of outcome
                }
            });
        }
    });

    // Helper function to add optional fields to requestBody
    function addOptionalField(obj, elementId, type = 'text') {
        const element = document.getElementById(elementId);
        if (element) {
            let value;
            if (type === 'checkbox') {
                value = element.checked;
                // Only include if true, or if you want to explicitly send false
                if (value) {
                    obj[elementId.split('_').slice(1).join('_')] = value;
                }
            } else {
                value = element.value.trim();
                if (value !== '') {
                    if (type === 'number') {
                        obj[elementId.split('_').slice(1).join('_')] = parseFloat(value);
                    } else {
                        obj[elementId.split('_').slice(1).join('_')] = value;
                    }
                }
            }
        }
    }

    // Helper function for list fields (e.g., preferred_brands)
    function addOptionalListField(obj, elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const value = element.value.trim();
            if (value !== '') {
                obj[elementId.split('_').slice(1).join('_')] = value.split(',').map(item => item.trim());
            }
        }
    }

    // Helper function to display errors on UI
    function displayError(message) {
        errorMessageDisplay.textContent = message;
        errorMessageDisplay.classList.remove('hidden');
    }
});