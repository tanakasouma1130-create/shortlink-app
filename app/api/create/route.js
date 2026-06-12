catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      error: String(error),
    },
    { status: 500 }
  );
}
