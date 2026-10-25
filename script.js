document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const lightbox = document.getElementById('lb');
  const lightboxImage = document.getElementById('lb-img');
  const lightboxClose = document.getElementById('lb-close');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open', 'zoomed');
  }

  function openLightbox(src) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.classList.remove('zoomed');
    lightbox.classList.add('open');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  if (lightboxImage) {
    lightboxImage.addEventListener('click', function () {
      if (!lightbox) return;
      lightbox.classList.toggle('zoomed');
    });
  }

  window.nimmOpenPhoto = openLightbox;

  const trackWrap = document.getElementById('ptrack-wrap');
  const track = document.getElementById('ptrack');

  if (trackWrap && track) {
    let x = 0;
    let speed = 0.04;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let setW = 0;
    let last = 0;
    let downX = 0;
    let downTarget = null;

    function measure() {
      setW = track.scrollWidth / 2;
    }

    measure();
    window.addEventListener('load', measure);

    function frame(timestamp) {
      if (!last) last = timestamp;
      const dt = timestamp - last;
      last = timestamp;

      if (!dragging) x -= speed * dt;
      if (setW > 0) {
        while (x <= -setW) x += setW;
        while (x > 0) x -= setW;
      }

      track.style.transform = 'translateX(' + x + 'px)';
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    trackWrap.addEventListener('pointerdown', function (event) {
      dragging = true;
      startX = event.clientX;
      startOffset = x;
      downX = event.clientX;
      downTarget = event.target;
      trackWrap.setPointerCapture(event.pointerId);
    });

    trackWrap.addEventListener('pointermove', function (event) {
      if (dragging) {
        x = startOffset + (event.clientX - startX);
      }
    });

    function end(event) {
      dragging = false;

      if (
        event &&
        Math.abs(event.clientX - downX) < 6 &&
        downTarget &&
        downTarget.closest('.photo-link')
      ) {
        const link = downTarget.closest('.photo-link');
        if (link && link.href) {
          window.location.href = link.href;
        }
        return;
      }

      if (
        event &&
        Math.abs(event.clientX - downX) < 6 &&
        downTarget &&
        downTarget.tagName === 'IMG' &&
        window.nimmOpenPhoto
      ) {
        window.nimmOpenPhoto(downTarget.src);
      }
    }

    trackWrap.addEventListener('pointerup', end);
    trackWrap.addEventListener('pointercancel', end);
  }

  document.querySelectorAll('.photo-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = link.href;
    });
  });

  const cards = document.querySelectorAll('#stack .rcard');
  if (cards.length) {
    const pos = [0, 1, 2, 3];
    const names = ['p0', 'p1', 'p2', 'p3'];

    function applyStackState() {
      cards.forEach(function (card, index) {
        card.className = 'review rcard ' + names[pos[index]];
      });
    }

    setInterval(function () {
      pos.splice(0, pos.length, ...pos.map(function (value) {
        return (value - 1 + 4) % 4;
      }));
      applyStackState();
    }, 3800);
  }

  const orderForm = document.getElementById('orderForm');
  const thankYouModal = document.getElementById('thankYouModal');
  const closeThankYou = document.getElementById('closeThankYou');

  if (closeThankYou && thankYouModal) {
    closeThankYou.addEventListener('click', function () {
      thankYouModal.classList.remove('open');
      thankYouModal.setAttribute('aria-hidden', 'true');
    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const honeypot = orderForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      const name = orderForm.querySelector('[name="name"]');
      const phone = orderForm.querySelector('[name="phone"]');
      const dish = orderForm.querySelector('[name="dish"]');
      const details = orderForm.querySelector('[name="details"]');

      if (!name || !phone || !details || !name.value.trim() || !phone.value.trim() || !details.value.trim()) {
        return;
      }

      const recipientEmail = 'batoolnimrah543@gmail.com';
      const body = [
        'Name: ' + (name ? name.value.trim() : ''),
        'Phone: ' + (phone ? phone.value.trim() : ''),
        'Dish: ' + (dish ? dish.value : ''),
        '',
        'Order details:',
        details ? details.value.trim() : ''
      ].join('\n');

      const mailtoLink = 'mailto:' + recipientEmail + '?subject=' + encodeURIComponent('New order - Nimm\'s Kitchen') + '&body=' + encodeURIComponent(body);

      if (thankYouModal) {
        thankYouModal.classList.add('open');
        thankYouModal.setAttribute('aria-hidden', 'false');
      }

      setTimeout(function () {
        window.location.href = mailtoLink;
      }, 700);
    });
  }

  const heroSlides = document.querySelectorAll('.slide');
  const heroDots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.arrow.prev');
  const nextButton = document.querySelector('.arrow.next');

  if (heroSlides.length) {
    let slideIndex = 0;

    function showSlide(index) {
      slideIndex = (index + heroSlides.length) % heroSlides.length;

      heroSlides.forEach(function (slide, slideNumber) {
        slide.classList.toggle('active', slideNumber === slideIndex);
      });

      heroDots.forEach(function (dot, dotNumber) {
        dot.classList.toggle('active', dotNumber === slideIndex);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(slideIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(slideIndex + 1);
      });
    }

    heroDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    setInterval(function () {
      showSlide(slideIndex + 1);
    }, 3800);
  }

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const cartButton = document.getElementById('cartButton');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutButton = document.getElementById('checkoutButton');

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('nimmCart') || '[]');
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('nimmCart', JSON.stringify(cart));
  }

  function toggleCart(forceOpen) {
    if (!cartDrawer) return;
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !cartDrawer.classList.contains('open');
    cartDrawer.classList.toggle('open', shouldOpen);
    cartDrawer.setAttribute('aria-hidden', String(!shouldOpen));
  }

  function renderCart() {
    const cart = getCart();
    const count = cart.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
    const total = cart.reduce(function (sum, item) {
      return sum + (item.price * item.quantity);
    }, 0);

    if (cartCount) cartCount.textContent = String(count);
    if (cartTotal) cartTotal.textContent = 'Rs ' + total;

    if (!cartItems) return;

    if (!cart.length) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add your favourites to get started.</p>';
      return;
    }

    cartItems.innerHTML = cart.map(function (item) {
      return '<div class="cart-item">' +
        '<div><div class="cart-item-name">' + item.name + ' x' + item.quantity + '</div></div>' +
        '<div class="cart-item-price">Rs ' + (item.price * item.quantity) + '</div>' +
        '<button class="cart-item-remove" type="button" data-name="' + item.name + '" aria-label="Remove ' + item.name + '">×</button>' +
      '</div>';
    }).join('');

    cartItems.querySelectorAll('.cart-item-remove').forEach(function (button) {
      button.addEventListener('click', function () {
        const itemName = button.getAttribute('data-name');
        const updated = getCart().filter(function (product) {
          return product.name !== itemName;
        });
        saveCart(updated);
        renderCart();
      });
    });
  }

  if (cartButton) {
    cartButton.addEventListener('click', function () {
      toggleCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', function () {
      toggleCart(false);
    });
  }

  document.querySelectorAll('.variant-option').forEach(function (option) {
    option.addEventListener('click', function () {
      const card = option.closest('.card');
      if (!card) return;

      const isAddon = option.classList.contains('addon-option');
      const isSize = option.classList.contains('size-option');

      if (isAddon || isSize) {
        const groupSelector = isAddon ? '.addon-option' : '.size-option';
        card.querySelectorAll(groupSelector).forEach(function (item) {
          item.classList.toggle('active', item === option);
        });
      } else {
        card.querySelectorAll('.variant-option').forEach(function (item) {
          item.classList.toggle('active', item === option);
        });
      }

      const addButton = card.querySelector('.add-cart-btn');
      if (addButton) {
        const selectedSize = card.querySelector('.size-option.active') || card.querySelector('.variant-option.active');
        const selectedAddon = card.querySelector('.addon-option.active');

        const chosenName = selectedSize ? selectedSize.getAttribute('data-name') : addButton.getAttribute('data-name');
        const sizePrice = Number(selectedSize ? selectedSize.getAttribute('data-price') : (addButton.getAttribute('data-price') || 0));
        const addonPrice = Number(selectedAddon ? selectedAddon.getAttribute('data-price') : 0);

        const finalName = selectedAddon && selectedAddon.getAttribute('data-name') !== 'Alfredo Pasta'
          ? selectedAddon.getAttribute('data-name')
          : chosenName;

        addButton.setAttribute('data-name', finalName || chosenName);
        addButton.setAttribute('data-price', String(sizePrice + addonPrice));
      }
    });
  });

  document.querySelectorAll('.add-cart-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const card = button.closest('.card');
      const selectedSize = card ? card.querySelector('.size-option.active') : null;
      const selectedAddon = card ? card.querySelector('.addon-option.active') : null;
      const name = selectedSize ? selectedSize.getAttribute('data-name') : button.getAttribute('data-name');
      const sizePrice = Number(selectedSize ? selectedSize.getAttribute('data-price') : (button.getAttribute('data-price') || 0));
      const addonPrice = Number(selectedAddon ? selectedAddon.getAttribute('data-price') : 0);
      const finalName = selectedAddon && selectedAddon.getAttribute('data-name') !== 'Alfredo Pasta'
        ? selectedAddon.getAttribute('data-name')
        : name;
      const price = sizePrice + addonPrice;
      const cart = getCart();
      const existing = cart.find(function (item) {
        return item.name === finalName;
      });

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name: finalName, price: price, quantity: 1 });
      }

      saveCart(cart);
      renderCart();
      toggleCart(true);
    });
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
      const cart = getCart();
      const orderField = document.getElementById('o-details');
      const orderDish = document.getElementById('o-dish');

      if (cart.length) {
        const summary = cart.map(function (item) {
          return item.name + ' x' + item.quantity + ' - Rs ' + (item.price * item.quantity);
        }).join('\n');

        if (orderField) {
          orderField.value = summary + '\n\nPlease prepare this order for me.';
        }

        if (orderDish) {
          orderDish.value = cart[0].name;
        }
      }

      toggleCart(false);
      const orderSection = document.getElementById('order');
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryImage = document.getElementById('galleryImage');
  const galleryTitle = document.getElementById('galleryTitle');
  const galleryDesc = document.getElementById('galleryDesc');
  const galleryMeta = document.getElementById('galleryMeta');
  const galleryDetail = document.querySelector('.gallery-detail');

  if (galleryCards.length && galleryImage && galleryTitle && galleryDesc && galleryMeta) {
    function updateGalleryCard(card) {
      galleryCards.forEach(function (item) {
        item.classList.toggle('active', item === card);
      });

      galleryImage.src = card.dataset.image || card.querySelector('img').src;
      galleryImage.alt = card.dataset.title || 'Food gallery image';
      galleryTitle.textContent = card.dataset.title || 'Nimm\'s Kitchen Dish';
      galleryDesc.textContent = card.dataset.description || 'Freshly made and served with care.';

      const tags = card.dataset.tags ? card.dataset.tags.split('|') : [];
      galleryMeta.innerHTML = tags.map(function (tag) {
        return '<li>' + tag + '</li>';
      }).join('');
    }

    const params = new URLSearchParams(window.location.search);
    const requestedItem = params.get('item');
    let activeCard = galleryCards[0];

    if (requestedItem) {
      const match = Array.from(galleryCards).find(function (card) {
        return (card.dataset.image || '').includes(requestedItem);
      });
      if (match) activeCard = match;
    }

    updateGalleryCard(activeCard);

    galleryCards.forEach(function (card) {
      card.addEventListener('click', function () {
        updateGalleryCard(card);
      });
    });

    if (galleryDetail) {
      galleryImage.addEventListener('click', function () {
        galleryDetail.classList.toggle('zoomed');
      });
    }
  }

  renderCart();
});
