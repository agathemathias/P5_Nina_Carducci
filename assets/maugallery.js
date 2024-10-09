(function ($) {
  $.fn.mauGallery = function (classes) {
    var classes = $.extend($.fn.mauGallery.defaults, classes);
    var  tousLesBouton = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));

        if (classes.lightBox) {
            $.fn.mauGallery.methods.createLightBox(
            $(this),
            classes.lightboxId,
            classes.navigation
            );
        }

        $.fn.mauGallery.listeners(classes),

        $(this)
          .children(".gallery-item")
          .each(function (l) {
            $.fn.mauGallery.methods.responsiveImageItem($(this)),
              $.fn.mauGallery.methods.moveItemInRowWrapper($(this)),
              $.fn.mauGallery.methods.wrapItemInColumn($(this), classes.columns);
            var theTag = $(this).data("gallery-tag");
            if (
              classes.showTags &&
              theTag !== undefined &&
              tousLesBouton.indexOf(theTag) === -1
            ) {
                tousLesBouton.push(theTag);
            }
          });

        if (classes.showTags) {
            $.fn.mauGallery.methods.showItemTags(
                $(this), 
                classes.tagsPosition, 
                tousLesBouton
            );
        }

      $(this).fadeIn(500);
    });
  };

/////   e = tousLesBouton     t = classes


  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  $.fn.mauGallery.listeners = function (classes) {
    $(".gallery-item").on("click", function () {
      if (classes.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), classes.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag),
      $(".gallery").on("click", ".mg-prev", () =>
        $.fn.mauGallery.methods.prevImage(classes.lightboxId)
      );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(classes.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
        .children()
        .first()
        .hasClass("row")
    ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, t) {
      if (t.constructor === Number) {
        element.wrap(
            `<div class='item-column mb-4 col-${Math.ceil(12 / t)}'></div>`
        );
        } else if (t.constructor === Object) {
        var e = "";
        t.xs && (e += ` col-${Math.ceil(12 / t.xs)}`),
          t.sm && (e += ` col-sm-${Math.ceil(12 / t.sm)}`),
          t.md && (e += ` col-md-${Math.ceil(12 / t.md)}`),
          t.lg && (e += ` col-lg-${Math.ceil(12 / t.lg)}`),
          t.xl && (e += ` col-xl-${Math.ceil(12 / t.xl)}`),
          element.wrap(`<div class='item-column mb-4${e}'></div>`);
      } else
        console.error(
          `Columns should be defined as numbers or objects. ${typeof t} is not supported.`
        );
    },

    moveItemInRowWrapper(element) {
        element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox(element, lightboxId) {
        $(`#${lightboxId}`)
          .find(".lightboxImage")
          .attr("src", element.attr("src"));
        $(`#${lightboxId}`).modal("toggle");
    },


    prevImage() {
      let imageActive = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
            imageActive = $(this);
        }
      });

      let boutonActif = $(".tags-bar span.active-tag").data("images-toggle");
      let collectionImages = [];
      "all" === boutonActif

        ? $(".item-column").each(function () {
            $(this).children("img").length && collectionImages.push($(this).children("img"));
          })
        : $(".item-column").each(function () {
            $(this).children("img").data("gallery-tag") === boutonActif &&
            collectionImages.push($(this).children("img"));
          });


      let index = 0,
        s = null;

      $(collectionImages).each(function (boutonActif) {
        $(imageActive).attr("src") === $(this).attr("src") && (index = boutonActif);
      }),
        (s = collectionImages[index-1] || collectionImages[collectionImages.length - 1]),
        $(".lightboxImage").attr("src", $(s).attr("src"));
    },


    nextImage() {
      let imageActive = null;
      $("img.gallery-item").each(function () {
        $(this).attr("src") === $(".lightboxImage").attr("src") &&
          (imageActive = $(this));
      });
      let boutonActif = $(".tags-bar span.active-tag").data("images-toggle"),
        collectionImages = [];
      "all" === boutonActif
        ? $(".item-column").each(function () {
            $(this).children("img").length && l.push($(this).children("img"));
          })
        : $(".item-column").each(function () {
            $(this).children("img").data("gallery-tag") === boutonActif &&
            collectionImages.push($(this).children("img"));
          });


      let index = 0,
        s = null;
      $(collectionImages).each(function (boutonActif) {
        $(imageActive).attr("src") === $(this).attr("src") && (index = boutonActif);
      }),
        (s = collectionImages[index+1] || collectionImages[0]),
        $(".lightboxImage").attr("src", $(s).attr("src"));
    },

    
    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },

    showItemTags(imageActive, boutonActif, collectionImages) {
      var i =
        '<li class="nav-item" tabindex="0"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(collectionImages, function (a, imageActive) {
        i += `<li class="nav-item active" tabindex="0"><span class="nav-link"  data-images-toggle="${imageActive}">${imageActive}</span></li>`;
      });
      var s = `<ul class="my-4 tags-bar nav nav-pills">${i}</ul>`;
      "bottom" === boutonActif
        ? imageActive.append(s)
        : "top" === boutonActif
        ? imageActive.prepend(s)
        : console.error(`Unknown tags position: ${boutonActif}`);
    },

    filterByTag() {
      if (!$(this).hasClass("active-tag")) {
        $(".active-tag").removeClass("active active-tag"),
          $(this).addClass("active-tag");
        var imageActive = $(this).data("images-toggle");
        $(".gallery-item").each(function () {
          $(this).parents(".item-column").hide(),
            "all" === imageActive
              ? $(this).parents(".item-column").show(300)
              : $(this).data("gallery-tag") === imageActive &&
                $(this).parents(".item-column").show(300);
        });
      }
    },
  };

})
(jQuery);

/////// t = imageActive    e = boutonActif   l = collectionImages ////