function AuditForm({
  url,
  setUrl,
  onSubmit,
  loading
}) {

  return (

    <div className="audit-form">

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
      />

      <button onClick={onSubmit}>

        {
          loading
          ? "Analyzing..."
          : "Run Audit"
        }

      </button>

    </div>

  );

}

export default AuditForm;