/*jslint indent: 2 */

(function ($) {
  "use strict";

  $.fn.flyout = function () {
    var $this, $tab, $list, openClass;

    $this = this;
    $tab = this.find("div.flyout-tab");
    $list = this.find("ul");
    openClass = "flyout-details-visible";

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

      $this.find(".flyout-tab-nub i")
        .toggleClass("fa-caret-left")
        .toggleClass("fa-caret-right");
    });
  };

  // Nested item selector
  $(function () {

    function setPickerPosition(itemPath, adding) {
      var top, left;
      left = $(itemPath).height();
      top = -left;
      if (adding) {
        top -= 48;
        left += 48;
      }

      $(itemPath).closest(".nested-item-picker").css('left', left);
      $(itemPath).siblings(".item-list-pane").css('top', top);
    }

    // Adds to the item path section
    $('div.nested-item-picker').on('click', '.item-parent', function () {
      var $this = $(this), itemPathValue = $this.text();

      setPickerPosition($this.parents('.nested-item-picker').find('.item-path'), true);

      $("ul.item-path").append('<li><a href="javascript:void(0);">' + itemPathValue + '</a></li>');
    });

    // Adds final option selected class
    $('div.nested-item-picker').on('click', '.final-option', function () {
      var $this = $(this);
      $this.toggleClass("final-option-selected");
    });

    $("ul.item-path").on('click', 'li', function () {
      var $this = $(this);
      $this.nextAll().remove();
      setPickerPosition($this.closest('.item-path'), false);
    });
  });

  $(function () {

    $("div.flyout-container").flyout();

    // Accordion
    $('.js-accordion-trigger').bind('click', function (e) {
      jQuery(this).parent().find('.submenu').slideToggle('fast');  // apply the toggle to the ul
      jQuery(this).parent().toggleClass('.is-closed');
      jQuery(this).find("i.chevron-toggle").toggleClass("closed");
      e.preventDefault();
    });

    // Sidebar menu
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
