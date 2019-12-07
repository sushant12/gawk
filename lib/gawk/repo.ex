defmodule Gawk.Repo do
  use Ecto.Repo,
    otp_app: :gawk,
    adapter: Ecto.Adapters.Postgres
end
