// calculator code
var discount, range, membership, image_type, pay_yearly, price_per_image, membership_price, discounted_price_per_image, number_of_images, images_subtotal, saved, total;

// Describe this function...
function Range_Function(id) {
//   membership = getValueFromInputData('range');
  CalculateAllRanges();
  updateValueInInput(range,'number_of_images-' + id);
  Total_Price();
}

function CalculateAllRanges(isReturn = false) {
  var range_total = 0;
  $('[name^="range-"]:visible').each((target, val) => {
    range_total += parseInt($(val).val());
  })
  $('#val-number-of-images').text(range_total);
  if (isReturn)
  	return range_total;
}

// Describe this function...
function Membership() {
  if (membership == 1) {
    membership_price = 0;
    discount = 0;
    $('#val-membership').text('0');
  } else if (membership == 2) {
    if (getValueFromInputData('pay_yearly')) {
      membership_price = 500;
      $('#val-membership').text((['$',membership_price,'/year'].join('')));
    } else {
      membership_price = 700;
      $('#val-membership').text((['$','350',' every 6 months'].join('')));
    }
    discount = 0.2;
  } else if (membership == 3) {
    if (getValueFromInputData('pay_yearly')) {
      membership_price = 2000;
      $('#val-membership').text((['$',membership_price,'/year'].join('')));
    } else {
      membership_price = 2800;
      $('#val-membership').text((['$','1400',' every 6 months'].join('')));
    }
    discount = 0.3;
  }
  Total_Price();
}

// Describe this function...
function Total_Price() {
  var current_range = CalculateAllRanges(true);
  var val_price_per_image = 0;
  var val_images_subtotal = 0;
  var min = 9999;
  var max = 0;
  if (price_per_image != null) {
    total = 0;
    saved = 0;
    $(checkedArray).each((key,val) => {
      current_range = $("#"+val["name"]).closest(".calc--checbox-block").find("[name^='number_of_images-']").val();
      price_per_image = parseFloat(val["price"]);
      min = Math.min(min, price_per_image);
      max = Math.max(max, price_per_image);
      discounted_price_per_image = price_per_image * (1 - discount);
      val_price_per_image += (Math.round(discounted_price_per_image*1))/1;
      images_subtotal = discounted_price_per_image * current_range;
      val_images_subtotal += (Math.round(images_subtotal*100))/100;
      saved += (price_per_image * current_range - images_subtotal) - membership_price;
      total += images_subtotal;
      if (saved < 0) {
        saved = 0;
      }
    });
    if (checkedArray.length > 1)
      $('#val-price-per-image').text(('$' + String(min) + " - $" + String(max)));
    else
      $('#val-price-per-image').text(('$' + String(val_price_per_image)));
    $('#val-images-subtotal').text(('$' + String(numberWithCommas(val_images_subtotal,","))));
    $('#val-saved').text(('$' + String(numberWithCommas((Math.round(saved*100))/100,","))));
    total += membership_price;
    $('#val-total').text(('$' + String(numberWithCommas((Math.round(total*100))/100,","))));
  }
}

discount = 0;
price_per_image = 0;
membership_price = 0;
range = 1;
membership = 1;
updateValueInInputData('1',"membership");

$("[name^='number_of_images-']").on("input", function (e) {
  let id = $(e.target).data("id");
  range = getValueFromInput('number_of_images-' + id);
  updateValueInInput(range,"range-" + id);
  CalculateAllRanges();
  Range_Function(id);
});
    // in case you input is radio button 
$("[name^='number_of_images-']").parent("label.w-radio").on("click", function () {
  let id = $(e.target).data("id");
  range = getValueFromInput('number_of_images-' + id);
  updateValueInInput(range,"range-" + id);
  CalculateAllRanges();
  Range_Function(id);
});

// html example: https://g6jds.csb.app/range_slider.txt
$(document).ready(function () {
    range = 1;
    $('[name^="range-"]').val(range);
    swiper_func_range('.range-thumb');
    $('[name^="range-"]').map((e) => {
      do_on_range_change_range(e.id);
    })
  });

  $("[name^='range-']").on("input", function (e) {
    range = $(e.target).val();
    swiper_func_range('.range-thumb');
    do_on_range_change_range($(e.target).data("id"));
  });

  function do_on_range_change_range(id) {
      Range_Function(id);
  }

  function swiper_func_range(swiper) {
    name = "[name^='range-']";
    var range_val = $(name).val();
    range_val = parseFloat(range_val);
    var range_width = $(name).width() - 10;
    var range_max = $(name).attr("max");
    range_width = range_width / range_max;
    range_width = range_width * (range_val - 1);
    $(swiper).css({ transform: "translateX(" + range_width + "px)" });
  }
$('.calc--btn-wrapper #calc-plus').on('click',function(e) {
  var range_id = $(e.target).closest(".calc__calc-wrapper").find("[type=range]").data("id");
  var current_range = $("[name^='range-"+range_id+"']").val();
  if (current_range < 500) {
    current_range = parseFloat(current_range);
    current_range = current_range + 1;
    updateValueInInput(current_range,"range-" + range_id);
    updateValueInInput(current_range,"number_of_images-" + range_id);
    CalculateAllRanges();
    Total_Price();
  }
});

$('.calc--btn-wrapper #calc-minus').on('click',function(e) {
  var range_id = $(e.target).closest(".calc__calc-wrapper").find("[type=range]").data("id");
  var current_range = $("[name^='range-"+range_id+"']").val();
  if (current_range > 0) {
    var range_id = $(e.target).closest(".calc__calc-wrapper").find("[type=range]").data("id");
    current_range = parseFloat(current_range);
    current_range = current_range - 1;
    updateValueInInput(current_range,"range-" + range_id);
    updateValueInInput(current_range,"number_of_images-" + range_id);
    CalculateAllRanges();
    Total_Price();
  }
});

$("[name=membership]").on("input", function () {
    membership = getValueFromInput("membership");
      Membership();
});

    $("[name=membership]").parent("label.w-radio").on("click", function () {
      clickedRadioButtonValue = $("input", this).val();
      membership = getValueFromInput("membership");
        Membership();
});

let checkedArray = []
$(".calc--checboxes-wrapper [type=checkbox]").on("click", function (event) {
    event.target.parentNode.classList.toggle("isChecked")
    let image_type = event.target.name;
    let result = 0;
    let calc_block_bg = $(event.target).closest('.calc--checbox-block');
    let range_block = $(event.target).closest('.calc--checbox-block').find(".calc__calc-wrapper");

    if(event.target.parentNode.classList.contains("isChecked")) {
			calc_block_bg[0].style.backgroundColor = "#dce4e4";
      range_block.show();
        let objItem = {}
        switch (event.target.name) {
            case "Group-photo":
                objItem = {name: "Group-photo", price: 150}
                break;
            case "Ghost-mannequin-photo":
                objItem = {name: "Ghost-mannequin-photo", price: 75}
                break;
            case "Paired-product-photo":
                objItem = {name: "Paired-product-photo", price: 75}
                break;
            case "Jewelry-watches-photo":
                objItem = {name: "Jewelry-watches-photo", price: 100}
                break;
            case "Hand-model-photo":
                objItem = {name: "Hand-model-photo", price: 150}
                break;
            case "Standard-Photo":
                objItem = {name: "Standard-Photo", price: 50}
                break;
        }
        checkedArray.push(objItem)
        for (let i = 0; i < checkedArray.length; i++) {
            result += checkedArray[i].price;
        }
        price_per_image = result;
        Total_Price();
    }
    else {
    	calc_block_bg[0].style.backgroundColor = "#ffffff";
      range_block.hide();
        if(checkedArray.length > 0) {
            checkedArray = checkedArray.filter(function(el) {
                return el.name != event.target.name;
            });

            for (let i = 0; i < checkedArray.length; i++) {
                result -= checkedArray[i].price;
            }
            price_per_image = Math.abs(result);
        }
        else {
            price_per_image = 0;
        }
        Total_Price();
    }
    if (checkedArray.length > 1) {
      $(".calc-col--right .price-per-image").text("Price range")
    } else {
      $(".calc-col--right .price-per-image").text("Price per image")
    }
});
$("[name=pay_yearly]").on("input", function () {
    pay_yearly = getValueFromInput("pay_yearly");
      Membership();
});

    $("[name=pay_yearly]").parent("label.w-radio").on("click", function () {
      clickedRadioButtonValue = $("input", this).val();
      pay_yearly = getValueFromInput("pay_yearly");
        Membership();
});

$('.window-closer').on("click", function () {
      $('body').css({
      "padding-right": "0",
      "overflow": "auto"
    });
});
