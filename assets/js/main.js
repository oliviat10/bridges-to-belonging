
(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});
			

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

})(jQuery);

/*document.addEventListener("DOMContentLoaded", function () {
    const pdfBaseURL = "zine pdfs/Yinzers on Third Places.pdf#page="; // Base URL of the PDF
    const pdfViewerPopup = document.getElementById("pdf-viewer-popup");
    const pdfFrame = document.getElementById("pdf-frame");

    // Function to open the pop-up with the correct page number
    function openPopup(pageNumber) {
        pdfFrame.src = pdfBaseURL + pageNumber;
        pdfViewerPopup.style.display = "flex";
    }

    // Function to close the pop-up
    window.closePopup = function () {
        pdfViewerPopup.style.display = "none";
        pdfFrame.src = ""; // Reset the iframe source when closing
    };

    // Add event listeners to pagination links
    document.querySelectorAll(".page-number").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = parseInt(this.getAttribute("data-page"));
            openPopup(page);
        });
    });

    // Close the pop-up when clicking outside the content
    pdfViewerPopup.addEventListener("click", function (event) {
        if (event.target === pdfViewerPopup) {
            closePopup();
        }
    });
});*/

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const totalPages = 4;
    const pdfBaseURL = "zine pdfs/Yinzers on Third Places.pdf#page=";
    const pdfViewerPopup = document.getElementById("pdf-viewer-popup");
    const pdfFrame = document.getElementById("pdf-frame");

    function showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        currentPage = pageNumber;

        // Hide all zine sections
        document.querySelectorAll(".zine").forEach(zine => {
            zine.style.display = "none";
        });

        // Show only the zines that belong to the current page
        document.querySelectorAll(`.zine-row[data-page="${pageNumber}"]`).forEach(row => {
            const parentZine = row.closest(".zine");
            if (parentZine) {
                parentZine.style.display = "block";
            }
        });

        // Update all paginators (top and bottom) with the active class
        document.querySelectorAll(".page-item").forEach(el => {
            el.classList.remove("current");
        });

        document.querySelectorAll(`.page-item a[data-page="${pageNumber}"]`).forEach(activePage => {
            activePage.parentElement.classList.add("current");
        });

        // Sync previous/next buttons in both paginators
        document.querySelectorAll("#prev-page").forEach(prevBtn => {
            prevBtn.style.opacity = pageNumber === 1 ? "0.5" : "1";
			prevBtn.style.pointerEvents = pageNumber === 1 ? "none" : "auto";
			prevBtn.style.cursor = pageNumber === 1 ? "default" : "pointer";
        });

        document.querySelectorAll("#next-page").forEach(nextBtn => {
            nextBtn.style.opacity = pageNumber === totalPages ? "0.5" : "1";
			nextBtn.style.pointerEvents = pageNumber === totalPages ? "none" : "auto";
			nextBtn.style.cursor = pageNumber === totalPages ? "default" : "pointer";

        });

		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
    }

    // Function to update all pagination elements
    function attachPaginationEventListeners() {
        document.querySelectorAll(".page-item a").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                let page = parseInt(this.getAttribute("data-page"));
                showPage(page);
            });
        });

        document.querySelectorAll("#prev-page").forEach(prevBtn => {
            prevBtn.addEventListener("click", function (event) {
                event.preventDefault();
                if (currentPage > 1) showPage(currentPage - 1);
            });
        });

        document.querySelectorAll("#next-page").forEach(nextBtn => {
            nextBtn.addEventListener("click", function (event) {
                event.preventDefault();
                if (currentPage < totalPages) showPage(currentPage + 1);
            });
        });
    }

    // Open PDF Viewer with the correct page
    function openPopup(pdfPage) {
        pdfFrame.src = pdfBaseURL + pdfPage;
        pdfViewerPopup.style.display = "flex";
    }

    // Close PDF Viewer
    window.closePopup = function () {
        pdfViewerPopup.style.display = "none";
        pdfFrame.src = "";
    };

    // Open PDF viewer when clicking on a zine page
    document.querySelectorAll(".zine-page-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let pdfPage = this.getAttribute("data-pdf-page");
            openPopup(pdfPage);
        });
    });

    // Close the pop-up when clicking outside the content
    pdfViewerPopup.addEventListener("click", function (event) {
        if (event.target === pdfViewerPopup) {
            closePopup();
        }
    });

    // Initialize the first page and attach event listeners
    attachPaginationEventListeners();
    showPage(1);

});
