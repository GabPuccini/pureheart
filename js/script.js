/* =========================================================
   PureHeart — Site script
   Mobile nav, scroll reveal, progress bars, form prototypes.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav_toggle');
  const navLinks = document.querySelector('.nav_links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is_open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is_open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector('.site_header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is_scrolled');
      else header.classList.remove('is_scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is_visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is_visible'));
  }

  /* ---------- Progress bars (campaign cards) ---------- */
  const progressBars = document.querySelectorAll('.progress_bar');
  if (progressBars.length && 'IntersectionObserver' in window) {
    const pio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const raised = parseFloat(bar.dataset.raised || '0');
          const goal = parseFloat(bar.dataset.goal || '1');
          const pct = Math.min(100, Math.round((raised / goal) * 100));
          requestAnimationFrame(() => { bar.style.width = pct + '%'; });
          pio.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(b => pio.observe(b));
  }

  /* ---------- Halls filter ---------- */
  const filterChips = document.querySelectorAll('.chip[data-filter]');
  const hallItems = document.querySelectorAll('[data-hall-capacity]');
  if (filterChips.length && hallItems.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('is_active'));
        chip.classList.add('is_active');
        const filter = chip.dataset.filter;
        hallItems.forEach(item => {
          const cap = parseInt(item.dataset.hallCapacity, 10);
          let show = true;
          if (filter === 'small') show = cap <= 40;
          else if (filter === 'medium') show = cap > 40 && cap <= 100;
          else if (filter === 'large') show = cap > 100;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Generic form helpers ---------- */
  function clearErrors(form) {
    form.querySelectorAll('.field.is_invalid').forEach(f => f.classList.remove('is_invalid'));
  }
  function showError(field) {
    field.classList.add('is_invalid');
    const input = field.querySelector('input, select, textarea');
    if (input) input.focus();
  }
  function validateRequired(form) {
    let ok = true;
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.field');
      if (!field) return;
      const value = (input.value || '').trim();
      if (!value) {
        ok = false;
        field.classList.add('is_invalid');
        if (!firstInvalid) firstInvalid = input;
      }
      if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        ok = false;
        field.classList.add('is_invalid');
        if (!firstInvalid) firstInvalid = input;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  /* ---------- Booking form (DF1) ---------- */
  const bookingForm = document.getElementById('booking_form');
  const bookingSuccess = document.getElementById('booking_success');
  if (bookingForm && bookingSuccess) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(bookingForm);
      if (!validateRequired(bookingForm)) return;
      const data = Object.fromEntries(new FormData(bookingForm).entries());
      console.log('Booking enquiry (prototype):', data);
      bookingForm.style.display = 'none';
      bookingSuccess.classList.add('is_visible');
      bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    document.getElementById('booking_reset')?.addEventListener('click', () => {
      bookingForm.reset();
      bookingForm.style.display = '';
      bookingSuccess.classList.remove('is_visible');
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    /* Prefill hall selection from query string or link */
    const params = new URLSearchParams(window.location.search);
    const preHall = params.get('hall');
    if (preHall) {
      const select = bookingForm.querySelector('[name="hall"]');
      if (select) {
        for (const opt of select.options) {
          if (opt.value === preHall) { opt.selected = true; break; }
        }
      }
    }
    /* Set min date to today */
    const dateInput = bookingForm.querySelector('[name="date"]');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  /* ---------- Donation form (DF2) ---------- */
  const donationForm = document.getElementById('donation_form');
  const donationSuccess = document.getElementById('donation_success');
  if (donationForm && donationSuccess) {
    /* Amount preset handling */
    const customAmount = donationForm.querySelector('[name="amount_custom"]');
    const amountInputs = donationForm.querySelectorAll('input[name="amount_preset"]');
    amountInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.checked && customAmount) customAmount.value = '';
      });
    });
    if (customAmount) {
      customAmount.addEventListener('input', () => {
        amountInputs.forEach(i => { i.checked = false; });
      });
    }

    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(donationForm);
      if (!validateRequired(donationForm)) return;
      const data = Object.fromEntries(new FormData(donationForm).entries());
      const amount = data.amount_custom ? parseFloat(data.amount_custom) : parseFloat(data.amount_preset || '0');
      if (!amount || amount < 1) {
        const amountField = donationForm.querySelector('.amount_field');
        if (amountField) amountField.classList.add('is_invalid');
        return;
      }
      data.total_amount = amount;
      console.log('Donation pledge (prototype):', data);
      const totalEl = document.getElementById('donation_total');
      if (totalEl) totalEl.textContent = '£' + amount.toFixed(2);
      donationForm.style.display = 'none';
      donationSuccess.classList.add('is_visible');
      donationSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    document.getElementById('donation_reset')?.addEventListener('click', () => {
      donationForm.reset();
      donationForm.style.display = '';
      donationSuccess.classList.remove('is_visible');
      donationForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    /* Prefill campaign from query string */
    const params = new URLSearchParams(window.location.search);
    const preCampaign = params.get('campaign');
    if (preCampaign) {
      const select = donationForm.querySelector('[name="campaign"]');
      if (select) {
        for (const opt of select.options) {
          if (opt.value === preCampaign) { opt.selected = true; break; }
        }
      }
    }
  }

  /* ---------- Smooth scroll for in page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && id.startsWith('#')) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Set current year in footer ---------- */
  const yearEl = document.getElementById('current_year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
