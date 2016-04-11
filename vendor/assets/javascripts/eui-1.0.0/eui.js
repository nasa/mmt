/*jslint indent: 2 */

(function ($) {
  "use strict";

  $.fn.presence = function(){
    return this.length > 0 ? this : false;
  }

  $.fn.flyout = function () {
    var $this, $tab, $list, openClass;

    $this = this;
    $tab = this.find(".eui-flyout__tab");
    $list = this.find("ul");
    openClass = "visible";

    $tab.on("click", function () {
      if ($list.hasClass(openClass)) {
        $this.animate({right: -$list.width()}, function () {
          $this.css({right: 0});
          $list.toggleClass(openClass);
        });
      } else {
        $list.toggleClass(openClass);
        $this.css({right: -$list.width()});
        $this.animate({right: 0});
      }
      var $flyoutIcon = $this.find(".eui-flyout__tab-nub i");

      $flyoutIcon.toggleClass("ed-fa-caret-left")
        .toggleClass("ed-fa-caret-right");

      var $span = $flyoutIcon.find('.eui-sr-only');

      if ($span.length === 1) {
        var className = $flyoutIcon.attr("class");
        if (className.contains("ed-fa-caret-left")) {
          $span[0].innerText = $span[0].textContent = 'Show flyout';
        } else if (className.contains("ed-fa-caret-right")) {
          $span[0].innerText = $span[0].textContent = 'Hide flyout';
        }
      }

    });
  };

  //flyout keyboard interactions
  $(function () {
    //expand flyout on keypress
    $(".eui-flyout__tab").keypress(function (e) {
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        $(".eui-flyout__tab").trigger("click");
      }
    });
  });

  //poi keyboard interactions
  $(function () {
    //keypress on point
    $(".point").keypress(function (e) {
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        $(this).toggleClass("visible");
      }
    });
  });

  // Nested item selector
  $(function () {

    function setPickerPosition(itemPath, adding) {
      var top, left;
      left = $(itemPath).height();
      top = -left;
      if (adding) {
        top -= 50;
        left += 50;
      }

      $(itemPath).closest(".eui-nested-item-picker").css('left', left);
      $(itemPath).siblings(".eui-item-list-pane").css('top', top);
    }

    // Adds to the item path section
    $('.eui-nested-item-picker').on('click', '.item-parent', function () {
      var $this = $(this), itemPathValue = $this.text();

      setPickerPosition($this.parents('.eui-nested-item-picker').find('.eui-item-path'), true);

      $("ul.eui-item-path").append('<li><a href="javascript:void(0);">' + itemPathValue + '</a></li>');
    });

    // Adds final option selected class
    $('.eui-nested-item-picker').on('click', '.final-option', function () {
      var $this = $(this);
      $this.toggleClass("final-option-selected");
    });

    $("ul.eui-item-path").on('click', 'li', function () {
      var $this = $(this);
      $this.nextAll().remove();
      setPickerPosition($this.closest('.eui-item-path'), false);
    });
  });

  $(function () {

    $(".eui-flyout").flyout();

  // FUNCTIONALITY: #Banner dismissal
    $('.eui-banner__dismiss').on('click', function () {
      var totalMessages = $(this).parents('[class^=eui-banner--]').find('.eui-banner__message').length;
      var thisMessage = $(this).parents('.eui-banner__message');

      if ($(thisMessage).length > 0 && totalMessages > 1) {
        $(thisMessage).remove();
      } else {
        $(this).parents('[class^=eui-banner--]').remove();
      }
    });

  // FUNCTIONALITY: #Accordion

    // Basic Accordion Functionality
    $(".eui-accordion__header").click(function() {
      $(this).siblings(".eui-accordion__body").slideToggle("fast");
      $(this).closest(".eui-accordion").toggleClass("is-closed");
    });

    $(".eui-accordion__icon").on("keyup", function(e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        $(this).parent().siblings(".accordion__body").slideToggle("fast");
        $(this).closest(".eui-accordion").toggleClass("is-closed");
      }
    });

    // Accordion URL Dependent Functionality
    function openHashAccordion(hash) {
      var $closedAccordions = $(hash).parents(".eui-accordion.is-closed");

      if ($closedAccordions.length) {
        $closedAccordions.removeClass("is-closed");
      }
    }

    function checkAccordionValidity(urlHash) {
      var accordionId = $("#" + urlHash);
      var accordionName = $("[name='" + urlHash + "']");

      if (accordionId.length > 0) {
        openHashAccordion(accordionId);
      } else if (accordionName.length > 0) {
        openHashAccordion(accordionName);
      }
    }

    var hash = window.location.hash.substring(1);

    if (hash) {
      checkAccordionValidity(hash);
    }

    $("a[href*='#']").on("click", function() {
      var linkHref = $(this).attr("href");
      var linkHash = linkHref.substring(linkHref.indexOf("#") + 1);
      checkAccordionValidity(linkHash);
    });

  // FUNCTIONALITY: #Sidebar menu
    $('.toggle-extended-content').bind('click', function (e) {
      jQuery(this).parent().find('.extended-content').slideToggle('fast', function () {
        if ($('.toggle-extended-content a').hasClass('open')) {
          $('.toggle-extended-content a').removeClass('open');
          $('.extended-content').removeClass('extended');
        } else {
          $('.toggle-extended-content a').addClass('open');
          $('.extended-content').addClass('extended');
        }
      });
      e.preventDefault();
    });
  });
}(jQuery));
;(function () {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','euiga');

	euiga('create', 'UA-62340125-3', 'auto', {'name': 'eui_tracker'});
	euiga('eui_tracker.send', 'pageview');
	euiga('eui_tracker.send', 'event', 'eui', 'loaded', '1.0.0');
})();;// leanModal v1.1 by Ray Stone - http://finelysliced.com.au
// Dual licensed under the MIT and GPL

(function($){$.fn.extend({leanModal:function(options){var defaults={top:100,overlay:0.5,closeButton:null};var overlay=$("<div id='lean_overlay'></div>");$("body").append(overlay);options=$.extend(defaults,options);return this.each(function(){var o=options;$(this).click(function(e){var modal_id=$(this).attr("href");$("#lean_overlay").click(function(){close_modal(modal_id)});$(o.closeButton).click(function(){close_modal(modal_id)});var modal_height=$(modal_id).outerHeight();var modal_width=$(modal_id).outerWidth();
$("#lean_overlay").css({"display":"block",opacity:0});$("#lean_overlay").fadeTo(200,o.overlay);$(modal_id).css({"display":"block","position":"fixed","opacity":0,"z-index":11000,"left":50+"%","margin-left":-(modal_width/2)+"px","top":o.top+"px"});$(modal_id).fadeTo(200,1);e.preventDefault()})});function close_modal(modal_id){$("#lean_overlay").fadeOut(200);$(modal_id).css({"display":"none"})}}})})(jQuery);
