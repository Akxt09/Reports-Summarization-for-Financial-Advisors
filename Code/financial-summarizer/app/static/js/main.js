$(document).ready(function() {
    // File upload handling
    const dropZone = $('#dropZone');
    const fileInput = $('#fileInput');
    const selectedFiles = $('#selectedFiles');
    
    // Drag and drop functionality with enhanced feedback
    dropZone.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    dropZone.on('dragleave', function() {
        $(this).removeClass('dragover');
    });
    
    dropZone.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        const files = e.originalEvent.dataTransfer.files;
        fileInput.prop('files', files);
        updateFileList(files);
    });
    
    fileInput.on('change', function() {
        updateFileList(this.files);
    });
    
    function updateFileList(files) {
        selectedFiles.empty();
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                selectedFiles.append(
                    `<div class="file-badge">
                        <i class="bi bi-file-earmark-pdf"></i> ${files[i].name}
                    </div>`
                );
            }
            
            // Add subtle animation to show files are selected
            selectedFiles.hide().fadeIn(300);
        }
    }
    $('#uploadForm').submit(function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // UI Initial State
        const $submitBtn = $('button[type="submit"]');
        $submitBtn.prop('disabled', true).addClass('processing');
        $('#processingProgress').removeClass('d-none').hide().fadeIn(300);
        $('#uploadSpinner').removeClass('d-none');
    
        // Progress Tracking Setup - Enhanced with more checkpoints for realism
        let progress = 0;
        const progressMessages = [
            { percent: 5, message: "Initializing upload process..." },
            { percent: 10, message: "Reading document structure..." },
            { percent: 15, message: "Uploading document data..." },
            { percent: 20, message: "Verifying document integrity..." },
            { percent: 25, message: "Preparing financial analysis..." },
            { percent: 30, message: "Analyzing document metadata..." },
            { percent: 35, message: "Processing financial statements..." },
            { percent: 45, message: "Identifying key metrics..." },
            { percent: 55, message: "Extracting financial insights..." },
            { percent: 65, message: "Generating visualizations..." },
            { percent: 70, message: "Comparing with industry standards..." },
            { percent: 75, message: "Creating executive summary..." },
            { percent: 80, message: "Formatting report sections..." },
            { percent: 85, message: "Finalizing document formatting..." },
            { percent: 90, message: "Preparing download options..." },
            { percent: 95, message: "Optimizing output quality..." }
        ];
        
        // Processing details for more realistic feedback
        const processingDetails = [
            "Parsing balance sheet data...",
            "Analyzing cash flow statements...",
            "Processing income statements...",
            "Calculating financial ratios...",
            "Identifying revenue trends...",
            "Validating quarterly comparisons...",
            "Generating YoY growth analysis...",
            "Applying industry benchmarks...",
            "Extracting key performance indicators...",
            "Implementing risk assessment models..."
        ];
        
        // Create a more natural progress simulation
        // Total execution time target: ~70 seconds
        const totalTime = 70000; // 70 seconds in ms
        const microUpdateInterval = 200; // Small updates every 200ms
        
        // Track when the last major update occurred
        let lastMajorUpdate = 0;
        let currentMessageIndex = 0;
        let processingDetailsIndex = 0;
        
        // Update the progress in small increments for smooth animation
        const microProgressInterval = setInterval(() => {
            // Only do micro updates when we're not at a major checkpoint
            if (currentMessageIndex < progressMessages.length) {
                const targetPercent = progressMessages[currentMessageIndex].percent;
                
                // Small random increment (0.1% to 0.5%)
                const randomIncrement = Math.random() * 0.4 + 0.1;
                
                // Don't exceed the next major checkpoint
                if (progress + randomIncrement < targetPercent) {
                    progress += randomIncrement;
                    updateProgress(progress, progressMessages[currentMessageIndex].message);
                    
                    // Update circular progress
                    updateCircularProgress(progress);
                    
                    // Occasionally show processing details for realism
                    if (Math.random() < 0.15) { // 15% chance on each micro-update
                        showProcessingDetail(processingDetails[processingDetailsIndex]);
                        processingDetailsIndex = (processingDetailsIndex + 1) % processingDetails.length;
                    }
                }
            }
        }, microUpdateInterval);
        
        // Progress Major Update Function - less frequent, more significant jumps
        const majorProgressInterval = setInterval(() => {
            if (currentMessageIndex < progressMessages.length) {
                progress = progressMessages[currentMessageIndex].percent;
                updateProgress(progress, progressMessages[currentMessageIndex].message);
                updateCircularProgress(progress);
                
                // Apply pulse animation on major updates
                $('.progress-pulse').addClass('pulse-animation');
                setTimeout(() => {
                    $('.progress-pulse').removeClass('pulse-animation');
                }, 800);
                
                currentMessageIndex++;
                
                // Show a processing detail with each major step
                showProcessingDetail(processingDetails[processingDetailsIndex]);
                processingDetailsIndex = (processingDetailsIndex + 1) % processingDetails.length;
            }
        }, totalTime / progressMessages.length);
    
        // Progress Update Function
        const updateProgress = (percent, message) => {
            $('.progress-bar')
                .css('width', percent + '%')
                .attr('aria-valuenow', percent)
                .removeClass('bg-danger');
            $('.progress-message').html(`
                <i class="bi bi-arrow-repeat spin"></i> ${message}
                <span class="progress-percent">${Math.round(percent)}%</span>
            `);
        };
        
        // Circular Progress Update
        const updateCircularProgress = (percent) => {
            const circle = $('.progress-circle-path')[0];
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
            
            $('.progress-circle-text').text(`${Math.round(percent)}%`);
        };
        
        // Show processing detail with fade effect
        const showProcessingDetail = (detail) => {
            $('.progress-detail').fadeOut(200, function() {
                $(this).html(`<i class="bi bi-cpu"></i> ${detail}`).fadeIn(200);
                
                // Auto-hide after a few seconds
                setTimeout(() => {
                    $(this).fadeOut(200);
                }, 2000);
            });
        };
    
        // AJAX Request
        $.ajax({
            url: '/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                clearInterval(microProgressInterval);
                clearInterval(majorProgressInterval);
                
                // Ensure we reach 100% smoothly
                const completeProgress = () => {
                    let currentPercent = parseFloat($('.progress-bar').attr('aria-valuenow'));
                    
                    if (currentPercent < 100) {
                        // Create a smooth transition to 100%
                        const remainingSteps = Math.ceil((100 - currentPercent) / 2);
                        let step = 0;
                        
                        const finalInterval = setInterval(() => {
                            step++;
                            currentPercent = Math.min(100, currentPercent + 2);
                            
                            if (step === remainingSteps / 2) {
                                updateProgress(currentPercent, "Preparing final documents...");
                            }
                            
                            if (step >= remainingSteps || currentPercent >= 100) {
                                clearInterval(finalInterval);
                                updateProgress(100, "Processing complete!");
                                updateCircularProgress(100);
                                
                                // Show success checkmark
                                setTimeout(() => {
                                    $('.progress-circle-text').fadeOut(300, function() {
                                        $(this).addClass('d-none');
                                        $('.checkmark').removeClass('d-none').hide().fadeIn(300);
                                    });
                                }, 500);
                                
                                // UI Transition
                                setTimeout(() => {
                                    $('#processingProgress').fadeOut(400, () => {
                                        $submitBtn.prop('disabled', false).removeClass('processing');
                                    });
                    
                                    // Update stepper states
                                    $('#uploadStep, #processStep').addClass('completed');
                                    $('#summaryStep').addClass('active').removeClass('completed');
                    
                                    // Handle summary preview
                                    const summaryText = response.preview.replace(/\n/g, '<br>');
                                    const summaryPreview = $('#summaryPreview');
                                    summaryPreview.empty().hide();
                    
                                    // Enhanced typing effect with variable speed
                                    let i = 0;
                                    const chunkSize = Math.max(50, Math.floor(summaryText.length / 25));
                                    let baseSpeed = Math.max(5, Math.min(40, 1800 / summaryText.length));
                    
                                    const typeWriter = () => {
                                        if (i < summaryText.length) {
                                            const end = Math.min(i + chunkSize, summaryText.length);
                                            summaryPreview.html(summaryText.substring(0, end));
                                            i = end;
                                            
                                            // Variable typing speed for realism
                                            const variableSpeed = baseSpeed * (0.7 + Math.random() * 0.6);
                                            
                                            // Occasional pause at punctuation
                                            const lastChar = summaryText.charAt(end-1);
                                            const delay = ['.', '!', '?', ':'].includes(lastChar) ? 
                                                variableSpeed * 4 : variableSpeed;
                                                
                                            setTimeout(typeWriter, delay);
                                        } else {
                                            summaryPreview.fadeIn(300);
                                        }
                                    };
                    
                                    $('#summarySection').removeClass('d-none').hide().fadeIn(800, () => {
                                        typeWriter();
                                        $('html, body').animate({
                                            scrollTop: $('#summarySection').offset().top - 20
                                        }, 1000);
                                    });
                                }, 1500);
                            } else {
                                updateProgress(currentPercent, "Finalizing output...");
                                updateCircularProgress(currentPercent);
                            }
                        }, 100);
                    } else {
                        // Already at 100%, proceed directly
                        updateProgress(100, "Processing complete!");
                        setTimeout(() => {
                            // UI Transition
                            $('#processingProgress').fadeOut(400, () => {
                                $submitBtn.prop('disabled', false).removeClass('processing');
                            });
                
                            // Further transitions as in original code
                            // ...
                        }, 1000);
                    }
                };
                
                completeProgress();
            },
            error: (xhr) => {
                clearInterval(microProgressInterval);
                clearInterval(majorProgressInterval);
                
                // Enhanced error handling with more dramatic visual feedback
                const errorAnimation = () => {
                    // Shake animation
                    $('#processingProgress').addClass('shake-animation');
                    
                    // Red flash effect
                    $('.progress-pulse').css('background', 'rgba(220, 53, 69, 0.1)').addClass('pulse-animation');
                    
                    // Progress bar visuals
                    $('.progress-bar')
                        .css('width', '100%')
                        .addClass('bg-danger')
                        .removeClass('progress-bar-striped progress-bar-animated');
                    
                    // Error message
                    updateProgress(0, "Processing failed - Please try again");
                    
                    // Circular progress error state
                    $('.progress-circle-path').css('stroke', '#dc3545');
                    $('.progress-circle-text').text('Error').css('color', '#dc3545');
                    
                    // Error detail message
                    showProcessingDetail("An error occurred during document processing");
                    
                    setTimeout(() => {
                        $('#processingProgress').removeClass('shake-animation');
                        $('.progress-pulse').removeClass('pulse-animation');
                    }, 1000);
                };
                
                errorAnimation();
    
                // Error handling
                const errorMsg = xhr.responseJSON?.error || 'Server processing error';
                const $errorAlert = $(`
                    <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        <i class="bi bi-x-circle-fill me-2"></i>
                        ${errorMsg}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `);
    
                // UI Reset
                setTimeout(() => {
                    $('#processingProgress').fadeOut(400);
                    $submitBtn.prop('disabled', false).removeClass('processing');
                    $('#uploadStep').removeClass('completed');
                    $('#processStep, #summaryStep').removeClass('active completed');
                    $errorAlert.insertAfter('#uploadForm').hide().slideDown();
                }, 2000);
            },
            complete: () => {
                $('#uploadSpinner').addClass('d-none');
            }
        });
    });

    // Evaluation with enhanced UX
    $('#runEvaluation').click(function() {
        // Update stepper
        $('#summaryStep').addClass('completed');
        $('#evaluateStep').addClass('active');
        
        $('#evalSpinner').removeClass('d-none');
        $(this).prop('disabled', true);

        // Add pulsing effect to the evaluation card
        $('.eval-card').addClass('pulse-light');

        $.ajax({
            url: '/evaluate',
            type: 'GET',
            success: function(response) {
                // Enhanced progress effect before showing results
                let evalProgress = 0;
                const evalInterval = setInterval(() => {
                    evalProgress += 5;
                    if (evalProgress <= 100) {
                        // Show progress message while evaluating
                        if (evalProgress === 20) {
                            showEvalMessage("Comparing summaries with source documents...");
                        } else if (evalProgress === 40) {
                            showEvalMessage("Measuring content relevance...");
                        } else if (evalProgress === 60) {
                            showEvalMessage("Calculating factual accuracy...");
                        } else if (evalProgress === 80) {
                            showEvalMessage("Finalizing evaluation metrics...");
                        }
                    } else {
                        clearInterval(evalInterval);
                        $('.eval-message').fadeOut(300, function() {
                            $(this).remove();
                        });
                        
                        // Remove the pulsing effect
                        $('.eval-card').removeClass('pulse-light');
                        
                        // Reset displayed values to ensure animation works
                        $('#relevancyScore').text('0.0%');
                        $('#faithfulnessScore').text('0.0%');
                        $('#recallScore').text('0.0%');
                        
                        // Show evaluation results section with a fade effect
                        $('#evalResults').hide().removeClass('d-none').fadeIn(500);
                        
                        // Store actual values
                        const relevancy = (response.relevancy * 100).toFixed(1);
                        const faithfulness = (response.faithfulness * 100).toFixed(1);
                        const recall = (response.recall * 100).toFixed(1);
                        
                        // Pulse effect on the metrics container
                        $('.metrics-container').addClass('pulse-light');
                        setTimeout(() => {
                            $('.metrics-container').removeClass('pulse-light');
                        }, 1000);
                        
                        // Delayed animation start for better UX
                        setTimeout(function() {
                            animateNumbers('#relevancyScore', relevancy);
                            
                            // Stagger animations for better visual effect
                            setTimeout(function() {
                                animateNumbers('#faithfulnessScore', faithfulness);
                            }, 400);
                            
                            setTimeout(function() {
                                animateNumbers('#recallScore', recall);
                            }, 800);
                        }, 400);
                    }
                }, 100);
                
                // Smooth scroll to evaluation section
                $('html, body').animate({
                    scrollTop: $('#evalResults').offset().top - 20
                }, 800);
            },
            error: function(xhr) {
                // Reset stepper state
                $('#evaluateStep').removeClass('active');
                
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.error : 'Unknown error occurred';
                
                // Show elegant error message with animation
                $('<div class="alert alert-danger mt-3 d-flex align-items-center" role="alert">')
                    .html(`
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>Evaluation failed: ${errorMsg}</div>
                    `)
                    .hide()
                    .insertAfter('#runEvaluation')
                    .slideDown(300)
                    .delay(5000)
                    .fadeOut(500, function() { $(this).remove(); });
            },
            complete: function() {
                $('#evalSpinner').addClass('d-none');
                $('#runEvaluation').prop('disabled', false);
            }
        });
        
        // Helper function to show eval messages
        function showEvalMessage(message) {
            // Remove existing message if it exists
            $('.eval-message').remove();
            
            // Create new message
            $('<div class="eval-message text-center mb-4">')
                .html(`<div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>${message}`)
                .hide()
                .insertBefore('#evalResults')
                .fadeIn(300);
        }
    });
    
    // Enhanced number animation function for metrics
    function animateNumbers(selector, targetValue) {
        const $element = $(selector);
        const duration = 2200;  // Extended for more dramatic effect
        const frameDuration = 1000/60;
        const totalFrames = Math.round(duration / frameDuration);
        
        // Enhanced easing function for more realistic animation
        const easeOutElastic = (t) => {
            const p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        };
        
        let frame = 0;
        const countTo = parseFloat(targetValue);
        
        // Start from 0 always for cleaner animation
        let count = 0;
        
        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = easeOutElastic(progress);
            const currentCount = countTo * Math.min(easedProgress, 1);
            
            // Format with 1 decimal place, and add thousandth separators for large numbers
            $element.text(currentCount.toFixed(1) + '%');
            
            // Add color fade effect based on the value
            if (currentCount > 0) {
                // Determine color based on value range
                let hue;
                if (selector === '#relevancyScore') {
                    hue = Math.min(120, Math.max(0, currentCount * 1.2));
                } else if (selector === '#faithfulnessScore') {
                    hue = Math.min(120, Math.max(0, currentCount * 1.2));
                } else {
                    hue = Math.min(120, Math.max(0, currentCount * 1.2));
                }
                
 
            }
            
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                $element.text(countTo.toFixed(1) + '%');
                
                // Scale animation on completion
                $element.parent().addClass('pulse-complete');
                setTimeout(() => {
                    $element.parent().removeClass('pulse-complete');
                }, 500);
            }
        };
        
        requestAnimationFrame(animate);
    }
});