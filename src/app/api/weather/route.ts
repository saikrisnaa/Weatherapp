import { NextRequest, NextResponse } from "next/server";

export async function GET(request:any) {
    const { searchParams } = new URL(request.url);
  const add = searchParams.get("address");
  const lati = searchParams.get("lat");
  const longi = searchParams.get("lon");
  let url = "";
  if (add) {
    url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      add +
      "&appid=" +
      "87d77e1fb541d499cfd7063bf59ea6d7";
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=87d77e1fb541d499cfd7063bf59ea6d7`;
  }
  console.log(url);
  const result = await fetch(url);

  const data = await result.json();
  return NextResponse.json({ data });
}