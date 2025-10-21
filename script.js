document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.getElementById('welcome-section');
    const appSection = document.getElementById('app-section');
    const displayUsername = document.getElementById('display-username');

    // NEW: Auth toggle elements
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    // NEW: Login elements
    const loginForm = document.getElementById('login-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginErrorMessage = document.getElementById('login-error');

    // NEW: Register elements
    const registerForm = document.getElementById('register-form');
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerErrorMessage = document.getElementById('register-error');
    const registerSuccessMessage = document.getElementById('register-success');

    const tabButtons = document.querySelectorAll('.tab-button');
    const deviceForms = document.querySelectorAll('.device-form');

    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessageDisplay = document.getElementById('error-message');
    const resultsDisplay = document.getElementById('results-display');
    const emailRecommendationsSection = document.getElementById('email-recommendations-section');
    const customerEmailInput = document.getElementById('customer-email');
    const sendEmailButton = document.getElementById('send-email-button');
    const emailSendConfirmation = document.getElementById('email-send-confirmation');
    const emailSendError = document.getElementById('email-send-error');

    let lastFetchedRecommendations = null; // To store the last recommendations

    const RENDER_BACKEND_BASE_URL = "https://final-project-yv26.onrender.com";
    const INGESTION_API_KEY = "cOeuEIPdT2kAc5JoRGo22kGZ3LBip7MUr03Q"; // Your access pass key

    // ============================================================
    // NEW: AUTH TOGGLE - Switch between Login and Register
    // ============================================================
    showLoginBtn.addEventListener('click', () => {
        showLoginBtn.classList.add('active');
        showRegisterBtn.classList.remove('active');
        loginFormContainer.classList.add('active');
        registerFormContainer.classList.remove('active');
        clearMessages();
    });

    showRegisterBtn.addEventListener('click', () => {
        showRegisterBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        registerFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active');
        clearMessages();
    });

    function clearMessages() {
        loginErrorMessage.classList.remove('active');
        registerErrorMessage.classList.remove('active');
        registerSuccessMessage.classList.remove('active');
    }

    // ============================================================
    // NEW: CHECK IF ALREADY LOGGED IN
    // ============================================================
    function checkExistingAuth() {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');

        if (token && username) {
            // Verify token is still valid
            fetch(`${RENDER_BACKEND_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Token is valid, go to app
                        displayUsername.textContent = username;
                        welcomeSection.classList.remove('active');
                        welcomeSection.classList.add('hidden');
                        appSection.classList.remove('hidden');
                    } else {
                        // Token expired, clear storage
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('username');
                    }
                })
                .catch(err => {
                    console.error('Auth check failed:', err);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('username');
                });
        }
    }

    // Check on page load
    checkExistingAuth();

    // ============================================================
    // NEW: REGISTRATION LOGIC
    // ============================================================
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const username = registerUsername.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value;

        // Basic validation
        if (username.length < 3) {
            registerErrorMessage.textContent = "Username must be at least 3 characters";
            registerErrorMessage.classList.add('active');
            return;
        }

        if (password.length < 8) {
            registerErrorMessage.textContent = "Password must be at least 8 characters";
            registerErrorMessage.classList.add('active');
            return;
        }

        try {
            const response = await fetch(`${RENDER_BACKEND_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            const data = await response.json();

            // Show success message
            registerSuccessMessage.textContent = `Account created successfully! Welcome, ${data.username}. Please login.`;
            registerSuccessMessage.classList.add('active');

            // Clear form
            registerForm.reset();

            // Auto-switch to login after 2 seconds
            setTimeout(() => {
                showLoginBtn.click();
                loginUsername.value = username; // Pre-fill username
            }, 2000);

        } catch (error) {
            registerErrorMessage.textContent = error.message;
            registerErrorMessage.classList.add('active');
        }
    });

    // ============================================================
    // NEW: LOGIN LOGIC
    // ============================================================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!username || !password) {
            loginErrorMessage.textContent = "Please enter both username and password";
            loginErrorMessage.classList.add('active');
            return;
        }

        try {
            const response = await fetch(`${RENDER_BACKEND_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();

            // Store token and username
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('username', username);
            localStorage.setItem('token_expiry', Date.now() + (data.expires_in * 1000));

            // Update UI
            displayUsername.textContent = username;
            welcomeSection.classList.remove('active');
            welcomeSection.classList.add('hidden');
            appSection.classList.remove('hidden');

            // Clear form
            loginForm.reset();

        } catch (error) {
            loginErrorMessage.textContent = error.message;
            loginErrorMessage.classList.add('active');
        }
    });

    // ============================================================
    // NEW: LOGOUT FUNCTIONALITY
    // ============================================================
    window.logout = function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('token_expiry');

        appSection.classList.add('hidden');
        welcomeSection.classList.remove('hidden');
        welcomeSection.classList.add('active');

        // Clear any displayed results
        resultsDisplay.innerHTML = '';
        errorMessageDisplay.classList.remove('active');
        emailRecommendationsSection.classList.add('hidden');
    };

    // ============================================================
    // NEW: HELPER - Get Auth Headers
    // ============================================================
    function getAuthHeaders() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // ============================================================
    // Tab Switching
    // ============================================================
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            deviceForms.forEach(form => form.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');

            resultsDisplay.innerHTML = '';
            errorMessageDisplay.classList.remove('active');
            loadingIndicator.classList.remove('active');
        });
    });

    // ============================================================
    // UPDATED: Form Submissions with JWT Authentication
    // ============================================================
    deviceForms.forEach(formDiv => {
        const form = formDiv.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                resultsDisplay.innerHTML = '';
                errorMessageDisplay.classList.remove('active');
                loadingIndicator.classList.add('active');

                const requestBody = {};
                let apiPath = '';

                switch (form.id) {
                    case 'phone-form':
                        apiPath = '/find_phone';
                        requestBody.user_base_prompt = document.getElementById('phone_user_base_prompt').value;
                        requestBody.location = document.getElementById('phone_location').value;
                        addOptionalField(requestBody, 'phone_budget', 'number');
                        addOptionalField(requestBody, 'phone_brand');
                        addOptionalField(requestBody, 'phone_os_preference');
                        addOptionalField(requestBody, 'phone_colour');
                        addOptionalField(requestBody, 'phone_ram');
                        addOptionalField(requestBody, 'phone_storage');
                        addOptionalField(requestBody, 'phone_processor');
                        addOptionalField(requestBody, 'phone_battery');
                        addOptionalField(requestBody, 'phone_display');
                        addOptionalField(requestBody, 'phone_camera_priority');
                        addOptionalListField(requestBody, 'phone_preferred_brands');
                        break;
                    case 'laptop-form':
                        apiPath = '/find_laptop';
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
                        apiPath = '/find_tablet';
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
                        apiPath = '/find_earpiece';
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
                        apiPath = '/find_prebuilt_pc';
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
                        apiPath = '/build_custom_pc';
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
                        displayError("Unknown form type");
                        loadingIndicator.classList.remove('active');
                        return;
                }

                if (!RENDER_BACKEND_BASE_URL || RENDER_BACKEND_BASE_URL === "YOUR_RENDER_BACKEND_URL_HERE") {
                    displayError("Backend URL not configured");
                    loadingIndicator.classList.remove('active');
                    return;
                }

                try {
                    const response = await fetch(fullUrl, {
                        method: 'POST',
                        headers: getAuthHeaders(),
                        body: JSON.stringify(requestBody),
                    });

                    // Handle rate limiting
                    if (response.status === 429) {
                        const errorData = await response.json();
                        const retryAfter = response.headers.get('Retry-After') || 'unknown';
                        displayError(
                            `Rate limit exceeded! ${errorData.detail}\n` +
                            `Please wait ${retryAfter} seconds before trying again.`
                        );
                        return;
                    }

                    if (response.status === 401) {
                        displayError('Session expired. Please login again.');
                        setTimeout(() => logout(), 2000);
                        return;
                    }

                    if (!response.ok) {
                        const errorData = await response.json();
                        displayError(errorData.detail || `Error: ${response.status}`);
                        return;
                    }

                    const data = await response.json();
                    displayResults(data);
                } catch (error) {
                    displayError('Network error or server is unreachable');
                    console.error('Request error:', error);
                } finally {
                    loadingIndicator.classList.remove('active');
                }
            });
        }
    });

    // ============================================================
    // Helper Functions
    // ============================================================
    function addOptionalField(obj, elementId, type = 'text') {
        const element = document.getElementById(elementId);
        if (element) {
            let value;
            if (type === 'checkbox') {
                value = element.checked;
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

    function addOptionalListField(obj, elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const value = element.value.trim();
            if (value !== '') {
                obj[elementId.split('_').slice(1).join('_')] = value.split(',').map(item => item.trim()).filter(item => item !== '');
            }
        }
    }

    function displayError(message) {
        errorMessageDisplay.textContent = message;
        errorMessageDisplay.classList.add('active');
    }

    function displayResults(data) {
        resultsDisplay.innerHTML = '';
        lastFetchedRecommendations = data; // Store the full data for email sending
        emailRecommendationsSection.classList.remove('hidden'); // Show email section
        emailSendConfirmation.classList.remove('active'); // Clear previous messages
        emailSendError.classList.remove('active'); // Clear previous messages

        // Handle error responses
        if (data.error || data.status === 'failed') {
            const errorBox = document.createElement('div');
            errorBox.className = 'error-box';
            errorBox.style.padding = '20px';
            errorBox.style.background = '#fee';
            errorBox.style.border = '2px solid #c00';
            errorBox.style.borderRadius = '8px';
            errorBox.style.marginBottom = '20px';
            errorBox.innerHTML = `
                <h3 style="color: #c00; margin-top: 0;">⚠️ Error</h3>
                <p><strong>Message:</strong> ${data.error || 'Request failed'}</p>
                ${data.status ? `<p><strong>Status:</strong> ${data.status}</p>` : ''}
            `;
            resultsDisplay.appendChild(errorBox);

            if (data.partial_data) {
                const pre = document.createElement('pre');
                pre.style.padding = '15px';
                pre.style.background = '#f7fafc';
                pre.style.borderRadius = '8px';
                pre.style.overflow = 'auto';
                pre.style.maxHeight = '300px';
                pre.textContent = typeof data.partial_data === 'string'
                    ? data.partial_data
                    : JSON.stringify(data.partial_data, null, 2);
                resultsDisplay.appendChild(pre);
            }
            return;
        }

        // Handle recommendations array
        if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
            data.recommendations.forEach((rec, index) => {
                // Check if this is a PC build (has components array)
                if (rec.components && Array.isArray(rec.components)) {
                    displayPCBuildRecommendation(rec, index);
                } else {
                    const card = createResultCard(rec, index);
                    resultsDisplay.appendChild(card);
                }
            });
        }
        // Handle single recommendation
        else if (data.recommendation && typeof data.recommendation === 'object') {
            const card = createResultCard(data.recommendation, 0);
            resultsDisplay.appendChild(card);
        }
        // Handle direct device data (fallback)
        else if (data.name || data.title || data.device_name) {
            const card = createResultCard(data, 0);
            resultsDisplay.appendChild(card);
        }
        // Last resort: show raw JSON
        else {
            const pre = document.createElement('pre');
            pre.style.padding = '20px';
            pre.style.background = '#f7fafc';
            pre.style.borderRadius = '8px';
            pre.style.overflow = 'auto';
            pre.style.maxHeight = '500px';
            pre.textContent = JSON.stringify(data, null, 2);
            resultsDisplay.appendChild(pre);
        }

        // Add AI note/summary if present
        if (data.ai_note || data.note || data.summary) {
            const note = document.createElement('div');
            note.className = 'ai-note';
            note.innerHTML = `<strong>AI Assistant Note:</strong> ${data.ai_note || data.note || data.summary}`;
            resultsDisplay.appendChild(note);
        }

        // Add metadata info if present
        if (data.metadata) {
            const meta = document.createElement('div');
            meta.className = 'metadata-info';
            meta.style.marginTop = '20px';
            meta.style.padding = '15px';
            meta.style.background = '#f0f4f8';
            meta.style.borderRadius = '8px';
            meta.style.fontSize = '0.9em';
            meta.style.color = '#64748b';

            let metaText = '';
            if (data.metadata.generated_at) {
                metaText += `Generated: ${new Date(data.metadata.generated_at).toLocaleString()} | `;
            }
            if (data.metadata.status) {
                metaText += `Status: ${data.metadata.status}`;
            }

            meta.textContent = metaText;
            resultsDisplay.appendChild(meta);
        }
    }

    function displayPCBuildRecommendation(rec, index) {
        const buildContainer = document.createElement('div');
        buildContainer.className = 'build-container';
        buildContainer.style.marginBottom = '30px';
        buildContainer.style.padding = '20px';
        buildContainer.style.background = '#f8fafc';
        buildContainer.style.borderRadius = '12px';
        buildContainer.style.border = '2px solid #3b82f6';

        // Build header
        const buildHeader = document.createElement('div');
        buildHeader.className = 'build-header';
        buildHeader.style.marginBottom = '20px';
        buildHeader.innerHTML = `
            <h3 style="color: #2563eb; margin-bottom: 10px;">
                ${rec.build_name || `PC Build ${index + 1}`}
                ${rec.rank ? `<span style="font-size: 0.8em; color: #64748b;"> (Rank #${rec.rank})</span>` : ''}
            </h3>
            ${rec.total_price ? `<p style="font-size: 1.3em; font-weight: bold; color: #059669;">Total: KES ${rec.total_price.toLocaleString()}</p>` : ''}
            ${rec.location ? `<p style="color: #64748b;">Location: ${rec.location}</p>` : ''}
            ${rec.description ? `<p style="color: #475569; margin-top: 10px;">${rec.description}</p>` : ''}
        `;
        buildContainer.appendChild(buildHeader);

        // Components
        if (rec.components && Array.isArray(rec.components)) {
            rec.components.forEach(component => {
                const componentCard = createComponentCard(component);
                buildContainer.appendChild(componentCard);
            });
        }

        // Build notes
        if (rec.build_notes || rec.notes || rec.compatibility_notes) {
            const notes = document.createElement('div');
            notes.className = 'ai-note';
            notes.style.marginTop = '15px';
            notes.innerHTML = `<strong>Build Notes:</strong> ${rec.build_notes || rec.notes || rec.compatibility_notes}`;
            buildContainer.appendChild(notes);
        }

        resultsDisplay.appendChild(buildContainer);
    }

    function createComponentCard(component) {
        const card = document.createElement('div');
        card.className = 'result-card component-card';
        card.style.marginBottom = '15px';
        card.style.background = '#ffffff';

        // Component header
        const header = document.createElement('div');
        header.className = 'result-header';

        const title = document.createElement('div');
        title.className = 'result-title';
        title.style.color = '#1e40af';
        title.innerHTML = `<strong>${component.category || 'Component'}:</strong> ${component.name || component.model || 'N/A'}`;

        const price = document.createElement('div');
        price.className = 'result-price';
        price.textContent = component.price ? `KES ${component.price.toLocaleString()}` : 'Price N/A';

        header.appendChild(title);
        header.appendChild(price);
        card.appendChild(header);

        // Description
        if (component.description || component.summary) {
            const desc = document.createElement('div');
            desc.className = 'result-description';
            desc.textContent = component.description || component.summary;
            card.appendChild(desc);
        }

        // Specs
        const specs = component.specs || component.specifications || {};
        if (Object.keys(specs).length > 0) {
            const specsContainer = document.createElement('div');
            specsContainer.className = 'result-specs';

            Object.entries(specs).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    const specItem = document.createElement('div');
                    specItem.className = 'spec-item';
                    specItem.innerHTML = `
                        <span class="spec-label">${formatLabel(key)}</span>
                        <span class="spec-value">${value}</span>
                    `;
                    specsContainer.appendChild(specItem);
                }
            });

            card.appendChild(specsContainer);
        }

        // Purchase links
        const linksContainer = document.createElement('div');
        linksContainer.className = 'result-links';
        linksContainer.style.display = 'flex';
        linksContainer.style.gap = '10px';
        linksContainer.style.flexWrap = 'wrap';

        // Online vendor
        if (component.vendor_online && component.vendor_online.url) {
            const onlineLink = document.createElement('a');
            onlineLink.className = 'result-link';
            onlineLink.href = component.vendor_online.url;
            onlineLink.target = '_blank';
            onlineLink.rel = 'noopener noreferrer';
            onlineLink.textContent = `🛒 ${component.vendor_online.store || 'Buy Online'}`;
            linksContainer.appendChild(onlineLink);
        }

        // Physical vendor info
        if (component.vendor_physical) {
            const physicalInfo = document.createElement('div');
            physicalInfo.style.padding = '10px';
            physicalInfo.style.background = '#f1f5f9';
            physicalInfo.style.borderRadius = '6px';
            physicalInfo.style.fontSize = '0.9em';
            physicalInfo.innerHTML = `
                <strong>🏪 Physical Store:</strong> ${component.vendor_physical.store || 'N/A'}<br>
                ${component.vendor_physical.contact_phone ? `📞 ${component.vendor_physical.contact_phone}<br>` : ''}
                ${component.vendor_physical.contact_email ? `📧 ${component.vendor_physical.contact_email}` : ''}
            `;
            linksContainer.appendChild(physicalInfo);
        }

        // Fallback to generic URL/link
        if (!component.vendor_online && (component.url || component.link)) {
            const link = document.createElement('a');
            link.className = 'result-link';
            link.href = component.url || component.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'View Component';
            linksContainer.appendChild(link);
        }

        if (linksContainer.children.length > 0) {
            card.appendChild(linksContainer);
        }

        return card;
    }

    function createResultCard(rec, index) {
        const card = document.createElement('div');
        card.className = 'result-card';

        // Header with title and price
        const header = document.createElement('div');
        header.className = 'result-header';

        const title = document.createElement('div');
        title.className = 'result-title';
        title.textContent = rec.name || rec.title || `Recommendation ${index + 1}`;

        const price = document.createElement('div');
        price.className = 'result-price';
        price.textContent = rec.price || rec.estimated_price || 'Price not available';

        header.appendChild(title);
        header.appendChild(price);
        card.appendChild(header);

        // Description
        if (rec.description || rec.summary) {
            const desc = document.createElement('div');
            desc.className = 'result-description';
            desc.textContent = rec.description || rec.summary;
            card.appendChild(desc);
        }

        // Specs
        const specsData = rec.specs || rec.specifications || rec.details || {};
        if (Object.keys(specsData).length > 0) {
            const specsContainer = document.createElement('div');
            specsContainer.className = 'result-specs';

            Object.entries(specsData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    const specItem = document.createElement('div');
                    specItem.className = 'spec-item';
                    specItem.innerHTML = `
                        <span class="spec-label">${formatLabel(key)}</span>
                        <span class="spec-value">${value}</span>
                    `;
                    specsContainer.appendChild(specItem);
                }
            });

            card.appendChild(specsContainer);
        }

        // Links
        const links = rec.links || rec.purchase_links || [];
        if (links.length > 0) {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'result-links';

            links.forEach(link => {
                const anchor = document.createElement('a');
                anchor.className = 'result-link';
                anchor.href = link.url || link;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.textContent = link.name || link.store || 'View Product';
                linksContainer.appendChild(anchor);
            });

            card.appendChild(linksContainer);
        } else if (rec.url || rec.link) {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'result-links';
            const anchor = document.createElement('a');
            anchor.className = 'result-link';
            anchor.href = rec.url || rec.link;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = 'View Product';
            linksContainer.appendChild(anchor);
            card.appendChild(linksContainer);
        }

        return card;
    }

    function formatLabel(str) {
        return str
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    // ============================================================
    // Email Recommendations Logic
    // ============================================================
    sendEmailButton.addEventListener('click', async () => {
        const customerEmail = customerEmailInput.value.trim();

        emailSendConfirmation.classList.remove('active');
        emailSendError.classList.remove('active');

        if (!customerEmail) {
            emailSendError.textContent = "Please enter an email address.";
            emailSendError.classList.add('active');
            return;
        }

        // Simple email format validation
        if (!/\S+@\S+\.\S+/.test(customerEmail)) {
            emailSendError.textContent = "Please enter a valid email address.";
            emailSendError.classList.add('active');
            return;
        }

        if (!lastFetchedRecommendations) {
            emailSendError.textContent = "No recommendations to send. Please find some first.";
            emailSendError.classList.add('active');
            return;
        }

        // Prepare the payload to send to n8n webhook
        const emailPayload = {
            recipientEmail: customerEmail,
            recommendations: lastFetchedRecommendations
        };

        const n8nWebhookUrl = "https://karanja-kariuki-2.app.n8n.cloud/webhook/fc9a2009-3066-45c6-b236-5d5dd8fd12bd";

        try {
            // Visually indicate sending process
            sendEmailButton.disabled = true;
            sendEmailButton.textContent = 'Sending...';

            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload),
            });

            if (response.ok) {
                emailSendConfirmation.textContent = `Recommendations sent successfully to ${customerEmail}!`;
                emailSendConfirmation.classList.add('active');
                customerEmailInput.value = ''; // Clear the input field
            } else {
                const errorText = await response.text();
                emailSendError.textContent = `Failed to send recommendations. Server responded with: ${response.status} - ${errorText.substring(0, 100)}...`;
                emailSendError.classList.add('active');
            }
        } catch (error) {
            emailSendError.textContent = `Network error: Could not reach the email sending service. ${error.message}`;
            emailSendError.classList.add('active');
        } finally {
            sendEmailButton.disabled = false;
            sendEmailButton.textContent = 'Send to Email';
        }
    });

    function initializeChatbot() {
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotMinimizeBtn = document.getElementById('chatbot-minimize-btn');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSendBtn = document.getElementById('chatbot-send-btn');
        const chatbotTyping = document.getElementById('chatbot-typing');

        const CHATBOT_API_URL = 'https://final-project-yv26.onrender.com/chat';
        let isWelcomeMessageShown = false;

        // Check if user is logged in and show/hide chatbot
        function updateChatbotVisibility() {
            const token = localStorage.getItem('access_token');
            if (token) {
                chatbotContainer.classList.remove('chatbot-hidden');
            } else {
                chatbotContainer.classList.add('chatbot-hidden');
            }
        }

        // Call this on page load and after login/logout
        updateChatbotVisibility();

        // Listen for login/logout events
        const originalLogout = window.logout;
        window.logout = function () {
            if (originalLogout) originalLogout();
            updateChatbotVisibility();
            // Reset chatbot state
            chatbotWindow.classList.remove('active');
            chatbotToggleBtn.classList.remove('active');
            isWelcomeMessageShown = false;
            chatbotMessages.innerHTML = '';
        };

        // Toggle chatbot window
        chatbotToggleBtn.addEventListener('click', () => {
            const isActive = chatbotWindow.classList.toggle('active');
            chatbotToggleBtn.classList.toggle('active');

            if (isActive && !isWelcomeMessageShown) {
                showWelcomeMessage();
                isWelcomeMessageShown = true;
            }
        });

        // Minimize button
        chatbotMinimizeBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotToggleBtn.classList.remove('active');
        });

        // Show welcome message
        function showWelcomeMessage() {
            const welcomeText = "Hello! 👋 I'm your DeviceFinder assistant. I can help you with device recommendations, answer questions about our products, and guide you through filling out the forms. How can I assist you today?";
            addMessage(welcomeText, 'bot');
        }

        // Add message to chat
        function addMessage(text, sender = 'bot') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = sender === 'bot' ? '🤖' : (localStorage.getItem('username')?.charAt(0).toUpperCase() || 'U');

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = text;

            const timestamp = document.createElement('div');
            timestamp.className = 'message-timestamp';
            timestamp.textContent = getCurrentTime();

            contentDiv.appendChild(bubble);
            contentDiv.appendChild(timestamp);

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);

            chatbotMessages.appendChild(messageDiv);
            scrollToBottom();
        }

        // Get current time formatted
        function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        // Scroll to bottom of messages
        function scrollToBottom() {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
            chatbotTyping.style.display = 'flex';
            scrollToBottom();
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            chatbotTyping.style.display = 'none';
        }

        // Show error message in chat
        function showChatError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chatbot-error-message';
            errorDiv.textContent = message;
            chatbotMessages.appendChild(errorDiv);
            scrollToBottom();

            // Remove error after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }

        // Send message to backend
        async function sendMessage(message) {
            if (!message.trim()) return;

            // Add user message to chat
            addMessage(message, 'user');
            chatbotInput.value = '';
            adjustTextareaHeight();

            // Disable input while processing
            chatbotInput.disabled = true;
            chatbotSendBtn.disabled = true;
            showTypingIndicator();

            try {
                const accessToken = localStorage.getItem('access_token');

                if (!accessToken) {
                    throw new Error('Not authenticated. Please login first.');
                }

                const response = await fetch(CHATBOT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        message: message
                    })
                });

                // Handle rate limiting
                if (response.status === 429) {
                    const errorData = await response.json();
                    const retryAfter = response.headers.get('Retry-After') || 'a few';
                    throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds before sending another message.`);
                }

                // Handle authentication errors
                if (response.status === 401) {
                    throw new Error('Session expired. Please login again.');
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Error: ${response.status}`);
                }

                const data = await response.json();

                // Add bot response to chat
                if (data.response) {
                    addMessage(data.response, 'bot');
                } else {
                    throw new Error('Invalid response from server');
                }

            } catch (error) {
                console.error('Chat error:', error);
                showChatError(error.message || 'Failed to send message. Please try again.');
            } finally {
                hideTypingIndicator();
                chatbotInput.disabled = false;
                chatbotSendBtn.disabled = false;
                chatbotInput.focus();
            }
        }

        // Handle send button click
        chatbotSendBtn.addEventListener('click', () => {
            const message = chatbotInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        });

        // Handle Enter key (Shift+Enter for new line)
        chatbotInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = chatbotInput.value.trim();
                if (message) {
                    sendMessage(message);
                }
            }
        });

        // Auto-resize textarea
        function adjustTextareaHeight() {
            chatbotInput.style.height = 'auto';
            chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + 'px';
        }

        chatbotInput.addEventListener('input', adjustTextareaHeight);

        // Prevent textarea from being too small
        chatbotInput.addEventListener('focus', adjustTextareaHeight);
    }

    // Initialize chatbot when DOM is loaded
    // If you're adding this to the existing script.js DOMContentLoaded listener,
    // just call initializeChatbot() at the end of that listener
    // Otherwise, use this:
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }
});