$(document).ready(function(){
    $("#pt_menu_link ul li").each(function(){
        var url = document.URL;
        $("#pt_menu_link ul li a").removeClass("act");
        $('#pt_menu_link ul li a[href="'+url+'"]').addClass('act');
    }); 
    
    $('.pt_menu_no_child').hover(function(){
        $(this).addClass("active");
    },function(){
        $(this).removeClass("active");
    })
    
    $('.pt_vegamenu .pt_menu').hover(function(){
        if($(this).attr("id") != "pt_menu_link"){
            $(this).addClass("active");
        }
    },function(){
        $(this).removeClass("active");
    })
    
    $('.pt_vegamenu .pt_menu').hover(function(){
       /*show popup to calculate*/
       $(this).find('.popup').css('display','inline-block');
       
       /* get total padding + border + margin of the popup */
       var extraWidth       = 0
       var wrapWidthPopup   = $(this).find('.popup').outerWidth(true); /*include padding + margin + border*/
       var actualWidthPopup = $(this).find('.popup').width(); /*no padding, margin, border*/
       extraWidth           = wrapWidthPopup - actualWidthPopup;    
       
       /* calculate new width of the popup*/
       var widthblock1 = $(this).find('.popup .block1').outerWidth(true);
       var widthblock2 = $(this).find('.popup .block2').outerWidth(true);
       var new_width_popup = 0;
       if(widthblock1 && !widthblock2){
           new_width_popup = widthblock1;
       }
       if(!widthblock1 && widthblock2){
           new_width_popup = widthblock2;
       }
       if(widthblock1 && widthblock2){
            if(widthblock1 >= widthblock2){
                new_width_popup = widthblock1;
            }
            if(widthblock1 < widthblock2){
                new_width_popup = widthblock2;
            }
       }
       var new_outer_width_popup = new_width_popup + extraWidth;
       
       
       /*return popup display none*/
       $(this).find('.popup').css('display','none');
       
       /*show hide popup*/
       if(VMEGAMENU_POPUP_EFFECT == 0) $(this).find('.popup').stop(true,true).slideDown('slow');
       if(VMEGAMENU_POPUP_EFFECT == 1) $(this).find('.popup').stop(true,true).fadeIn('slow');
       if(VMEGAMENU_POPUP_EFFECT == 2) $(this).find('.popup').stop(true,true).show('slow');
    },function(){
       if(VMEGAMENU_POPUP_EFFECT == 0) $(this).find('.popup').stop(true,true).slideUp();
       if(VMEGAMENU_POPUP_EFFECT == 1) $(this).find('.popup').stop(true,true).fadeOut('slow');
       if(VMEGAMENU_POPUP_EFFECT == 2) $(this).find('.popup').stop(true,true).hide('fast');
    })
	
	$(".pt_vegamenu .pt_vmegamenu_title").on('click', function(e){
		e.stopPropagation();
		var vega = $(".pt_vegamenu .pt_vegamenu_cate");
		if(vega.is(':hidden')){
			vega.slideDown();
		} else {
			vega.slideUp();
		}
		e.preventDefault();
	});
	
    $(".pt_ver_menu_link ul li").each(function(){
        var url = document.URL;
        $(".pt_ver_menu_link ul li a").removeClass("act");
        $('.pt_ver_menu_link ul li a[href="'+url+'"]').addClass('act');
    }); 
	var count_block = $('.pt_vegamenu .pt_menu').length; 
	var number_blocks = 8;
	if(count_block < number_blocks){
		return false; 
	} else {
		$('.pt_vegamenu .pt_menu').each(function(i,n){
			if(i == number_blocks) {
				$('.pt_vegamenu_cate').append('<div class="pt_menu noSub"><div class="parentMenu"><a href="javascript:void(0)" class="view_more"><span><i class="icon-plus"></i>' + MORE + '</span></a></div></div>');
			}
			if(i> number_blocks) {
				$(this).addClass('hide_menu_block');
			}
		})
		$('.hide_menu_block').hide();
		$('.view_more').click(function() {
			$(this).toggleClass('active');
			if($(this).hasClass('active')){
				$(this).addClass('open_menu');
				$(this).html('<em class="closed-menu"><i class=" icon-minus"></i>'+ CLOSE +'</em>');
				$('.hide_menu_block').slideDown();	
			}
			else
			{
				$(this).removeClass('open_menu').addClass('close_menu');
				$(this).html('<em class="closed-menu"><i class="icon-plus"></i>'+ MORE +'</em>'); 
				$('.hide_menu_block').slideUp();
				
			}
	
		});
	}
});