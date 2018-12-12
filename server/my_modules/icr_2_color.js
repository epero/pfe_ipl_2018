/**
 * Returns the color of an icr
 */

const get = icr => {
  switch (icr) {
    case "1":
    case "1A":
    case "1B":
      color = "#00cc00";
      break;
    case "2":
    case "2A":
    case "2B":
      color = "#99b3ff";
      break;
    case "3":
    case "3A":
    case "3B":
      color = "#FF3232";
      break;
    case "4":
    case "4A":
    case "4B":
      color = "#9932FF";
      break;
    case "5":
    case "5A":
    case "5B":
      color = "#00510A";
      break;
    case "6":
    case "6A":
    case "6B":
      color = "#00510A";
      break;
    case "7":
    case "7A":
    case "7B":
      color = "#D12200";
      break;
    case "8":
    case "8A":
    case "8B":
      color = "#00cc00";
      break;
    case "9":
    case "9A":
    case "9B":
      color = "#9932FF";
      break;
    case "10":
    case "10A":
    case "10B":
      color = "#FF3232";
      break;
    case "11":
    case "11A":
    case "11B":
      color = "#187c00";
      break;
    case "12":
    case "12A":
    case "12B":
      color = "#00510A";
      break;
    case "A":
      color = "#FF8205";
      break;
    case "B":
      color = "#FF8205";
      break;
    case "C":
      color = "#FF8205";
      break;
    case "CK":
    case "CKA":
    case "CKB":
      color = "#05AFFF";
      break;
    case "SZ":
    case "SZA":
    case "SZB":
      color = "#05AFFF";
      break;
    case "MM":
    case "MMA":
    case "MMB":
      color = "#00256B";
      break;
    case "PP":
    case "PPA":
    case "PPB":
      color = "#D12200";
      break;
    default:
      color = "#0000FF";
  }
  return color;
};

exports.get = get;
