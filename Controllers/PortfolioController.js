import Portfolio from "../Models/Portfolio.js";

export const createPortfolio = async (req, res) => {
  try {
    const { customerId, subdomain, customDomain, ...portfolioData } = req.body;

    const existingPortfolio = await Portfolio.findOne({
      $or: [{ subdomain }, { customDomain }]
    });

    if (existingPortfolio) {
      return res.status(400).json({ message: "Subdomain or Custom Domain already taken." });
    }

    const portfolio = new Portfolio({ customerId, subdomain, customDomain, ...portfolioData });
    await portfolio.save();
    
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(portfolioId, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const deletedPortfolio = await Portfolio.findByIdAndDelete(portfolioId);

    if (!deletedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
