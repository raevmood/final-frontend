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

    const RENDER_BACKEND_BASE_URL = "https://final-project-yv26.onrender.com";

    // Login Logic
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            displayUsername.textContent = username;
            welcomeSection.classList.remove('active');
            welcomeSection.classList.add('hidden');
            appSection.classList.remove('hidden');
            loginErrorMessage.classList.remove('active');
        } else {
            loginErrorMessage.textContent = "Please enter your name to proceed.";
            loginErrorMessage.classList.add('active');
        }
    });

    // Tab Switching
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

    // Form Submissions
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
                    const fullUrl = `${RENDER_BACKEND_BASE_URL}${apiPath}`;
                    const response = await fetch(fullUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        displayError(errorData.detail || `Error: ${response.status}`);
                        return;
                    }

                    const data = await response.json();
                    displayResults(data);
                } catch (error) {
                    displayError('Network error or server is unreachable');
                } finally {
                    loadingIndicator.classList.remove('active');
                }
            });
        }
    });

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

            // Still try to show partial data if available
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

        // Handle PC Builder (component-based) responses
        if (data.components || data.build_components) {
            displayPCBuildResults(data);
            return;
        }

        // Handle multiple recommendations
        if (data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
            data.recommendations.forEach((rec, index) => {
                const card = createResultCard(rec, index);
                resultsDisplay.appendChild(card);
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

    function displayPCBuildResults(data) {
        const components = data.components || data.build_components || {};

        // Create a header for the build
        const buildHeader = document.createElement('div');
        buildHeader.className = 'build-header';
        buildHeader.style.marginBottom = '20px';
        buildHeader.innerHTML = `
            <h3 style="color: #2563eb; margin-bottom: 10px;">Custom PC Build</h3>
            ${data.total_price ? `<p style="font-size: 1.2em; font-weight: bold;">Total: ${data.total_price}</p>` : ''}
            ${data.description ? `<p style="color: #64748b;">${data.description}</p>` : ''}
        `;
        resultsDisplay.appendChild(buildHeader);

        // Display each component
        Object.entries(components).forEach(([componentType, componentData]) => {
            if (!componentData || typeof componentData !== 'object') return;

            const card = document.createElement('div');
            card.className = 'result-card component-card';
            card.style.marginBottom = '15px';

            // Component header
            const header = document.createElement('div');
            header.className = 'result-header';

            const title = document.createElement('div');
            title.className = 'result-title';
            title.style.color = '#1e40af';
            title.textContent = `${formatLabel(componentType)}: ${componentData.name || componentData.model || 'N/A'}`;

            const price = document.createElement('div');
            price.className = 'result-price';
            price.textContent = componentData.price || componentData.estimated_price || 'Price N/A';

            header.appendChild(title);
            header.appendChild(price);
            card.appendChild(header);

            // Description
            if (componentData.description || componentData.summary) {
                const desc = document.createElement('div');
                desc.className = 'result-description';
                desc.textContent = componentData.description || componentData.summary;
                card.appendChild(desc);
            }

            // Specs
            const specs = componentData.specs || componentData.specifications || {};
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
            if (componentData.url || componentData.link || componentData.purchase_link) {
                const linksContainer = document.createElement('div');
                linksContainer.className = 'result-links';
                const anchor = document.createElement('a');
                anchor.className = 'result-link';
                anchor.href = componentData.url || componentData.link || componentData.purchase_link;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.textContent = 'View Component';
                linksContainer.appendChild(anchor);
                card.appendChild(linksContainer);
            }

            resultsDisplay.appendChild(card);
        });

        // Add build notes
        if (data.build_notes || data.notes || data.compatibility_notes) {
            const notes = document.createElement('div');
            notes.className = 'ai-note';
            notes.style.marginTop = '20px';
            notes.innerHTML = `<strong>Build Notes:</strong> ${data.build_notes || data.notes || data.compatibility_notes}`;
            resultsDisplay.appendChild(notes);
        }
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
});